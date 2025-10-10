"use client";

import { useEffect, useMemo, useState } from "react";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface CommentItem {
  id: number;
  content: string;
  created_date: string;
  user: { id: number; username: string; full_name?: string; is_staff?: boolean; groups?: string[] };
  parent?: number | null;
  reply_count?: number;
  like_count?: number;
  liked_by_me?: boolean;
  replies?: CommentItem[];
}

export default function LikeCommentPanel({ slug, likedByMe, likeCount, commentCount }: { slug: string; likedByMe?: boolean; likeCount?: number; commentCount?: number }) {
  const { isAuthenticated } = useAuth();
  const [liked, setLiked] = useState(!!likedByMe);
  const [likes, setLikes] = useState(likeCount ?? 0);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [replyDrafts, setReplyDrafts] = useState<Record<number, string>>({});
  const [replySubmitting, setReplySubmitting] = useState<Record<number, boolean>>({});
  const [replyOpen, setReplyOpen] = useState<Record<number, boolean>>({});
  const totalComments = useMemo(() => commentCount ?? comments.length ?? 0, [commentCount, comments.length]);

  const timeAgo = (iso: string) => {
    try {
      const d = new Date(iso).getTime();
      const diff = Math.max(0, Date.now() - d);
      const sec = Math.floor(diff / 1000);
      if (sec < 60) return `${sec}s ago`;
      const min = Math.floor(sec / 60);
      if (min < 60) return `${min}m ago`;
      const hr = Math.floor(min / 60);
      if (hr < 24) return `${hr}h ago`;
      const day = Math.floor(hr / 24);
      if (day < 7) return `${day}d ago`;
      return new Date(iso).toLocaleDateString();
    } catch {
      return new Date(iso).toLocaleString();
    }
  };

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        setLoadingComments(true);
        const { data } = await api.get(`/articles/${slug}/comments/?include_replies=true`);
        if (!ignore) setComments(Array.isArray(data) ? data : data.results ?? []);
      } catch {
        // ignore
      } finally {
        if (!ignore) setLoadingComments(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, [slug]);

  const toggleLike = async () => {
    try {
      if (!liked) {
        await api.post(`/articles/${slug}/like/`);
        setLiked(true);
        setLikes((n) => n + 1);
      } else {
        await api.delete(`/articles/${slug}/like/`);
        setLiked(false);
        setLikes((n) => Math.max(0, n - 1));
      }
    } catch (e) {
      // noop
    }
  };

  const submitComment = async () => {
    const trimmed = newComment.trim();
    if (!trimmed) return;
    if (trimmed.length > 300) return;
    try {
      setSubmitting(true);
      const { data } = await api.post(`/articles/${slug}/comments/`, { content: trimmed });
      setComments((prev) => [data, ...prev]);
      setNewComment("");
    } catch (e) {
      // noop
    } finally {
      setSubmitting(false);
    }
  };

  const toggleCommentLike = async (commentId: number) => {
    try {
      // Determine current liked state before optimistic update
      let currentlyLiked = false;
      for (const c of comments) {
        if (c.id === commentId) { currentlyLiked = !!c.liked_by_me; break; }
        if (c.replies) {
          const r = c.replies.find((x) => x.id === commentId);
          if (r) { currentlyLiked = !!r.liked_by_me; break; }
        }
      }
      // Optimistic UI update (both top-level and replies)
      setComments((prev) => prev.map((c) => {
        if (c.id === commentId) {
          const liked = !!c.liked_by_me;
          return { ...c, liked_by_me: !liked, like_count: Math.max(0, (c.like_count || 0) + (liked ? -1 : 1)) };
        }
        if (Array.isArray(c.replies) && c.replies.length) {
          const replies = c.replies.map((r) => {
            if (r.id !== commentId) return r;
            const liked = !!r.liked_by_me;
            return { ...r, liked_by_me: !liked, like_count: Math.max(0, (r.like_count || 0) + (liked ? -1 : 1)) };
          });
          return { ...c, replies };
        }
        return c;
      }));
      // Call API based on previous liked state
      if (currentlyLiked) {
        await api.delete(`/articles/${slug}/comments/${commentId}/like/`);
      } else {
        await api.post(`/articles/${slug}/comments/${commentId}/like/`);
      }
    } catch {
      // on error, best-effort refetch
      try {
        const { data } = await api.get(`/articles/${slug}/comments/?include_replies=true`);
        setComments(Array.isArray(data) ? data : data.results ?? []);
      } catch {}
    }
  };

  const setReplyText = (commentId: number, text: string) => {
    if (text.length > 300) text = text.slice(0, 300);
    setReplyDrafts((m) => ({ ...m, [commentId]: text }));
  };

  const submitReply = async (parentId: number) => {
    const text = (replyDrafts[parentId] || "").trim();
    if (!text) return;
    if (text.length > 300) return;
    try {
      setReplySubmitting((m) => ({ ...m, [parentId]: true }));
      const { data } = await api.post(`/articles/${slug}/comments/${parentId}/reply/`, { content: text });
      setComments((prev) => prev.map((c) => {
        if (c.id !== parentId) return c;
        const replies = Array.isArray(c.replies) ? c.replies : [];
        return { ...c, replies: [data, ...replies], reply_count: (c.reply_count || 0) + 1 };
      }));
      setReplyDrafts((m) => ({ ...m, [parentId]: "" }));
      setReplyOpen((m) => ({ ...m, [parentId]: false }));
    } catch {
      // noop
    } finally {
      setReplySubmitting((m) => ({ ...m, [parentId]: false }));
    }
  };

  return (
    <section className="mt-10 border-t border-gray-200 pt-6">
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={toggleLike}
          disabled={!isAuthenticated}
          className={`px-3 py-1 rounded border text-sm ${liked ? 'bg-red-100 border-red-300 text-red-700' : 'bg-white border-gray-300 text-gray-700'} disabled:opacity-50`}
          aria-pressed={liked}
        >
          {liked ? '♥ Liked' : '♡ Like'} ({likes})
        </button>
        <div className="text-sm text-gray-600">Comments ({totalComments})</div>
      </div>

      {isAuthenticated ? (
        <div className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => {
              const v = e.target.value;
              setNewComment(v.length > 300 ? v.slice(0, 300) : v);
            }}
            className="w-full border rounded p-2 text-sm"
            rows={3}
            placeholder="Add a comment"
          />
          <div className="flex items-center justify-between mt-2">
            <div className={`text-xs ${newComment.length > 300 ? 'text-red-600' : 'text-gray-500'}`}>{newComment.length}/300</div>
            <button onClick={submitComment} disabled={submitting || !newComment.trim()} className="bg-primary text-white text-sm px-3 py-1 rounded disabled:opacity-50">
              {submitting ? 'Posting…' : 'Post Comment'}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-600 mb-4">Log in to like and comment.</div>
      )}

      <div>
        {loadingComments ? (
          <div className="text-sm text-gray-500">Loading comments…</div>
        ) : comments.length === 0 ? (
          <div className="text-sm text-gray-500">No comments yet.</div>
        ) : (
          <ul className="space-y-6">
            {comments.map((c) => (
              <li key={c.id} className="border-b pb-4">
                <div className="text-sm text-gray-800 font-medium flex items-center gap-2">
                  <span>{c.user.full_name || c.user.username}</span>
                  {(c.user.is_staff || (c.user.groups || []).includes('Editor') || (c.user.groups || []).includes('Staff')) && (
                    <span title="Staff" className="text-[10px] font-semibold bg-gray-800 text-white px-2 py-0.5 rounded-full">STAFF</span>
                  )}
                  {(c.user.groups || []).includes('Editor') && (
                    <span title="Editor" className="text-[10px] font-semibold bg-blue-600 text-white px-2 py-0.5 rounded-full">EDITOR</span>
                  )}
                </div>
                <div className="text-xs text-gray-500">{timeAgo(c.created_date)}</div>
                <p className="text-sm text-gray-800 mt-1 whitespace-pre-wrap">{c.content}</p>
                <div className="mt-2 flex items-center gap-4 text-xs">
                  <button
                    onClick={() => toggleCommentLike(c.id)}
                    disabled={!isAuthenticated}
                    className="inline-flex items-center gap-1 text-gray-700 hover:text-red-600 disabled:opacity-50"
                    aria-pressed={!!c.liked_by_me}
                  >
                    {c.liked_by_me ? (
                      <HeartSolid className="h-4 w-4 text-red-600" />
                    ) : (
                      <HeartOutline className="h-4 w-4" />
                    )}
                    <span>{c.like_count ?? 0}</span>
                  </button>
                  {isAuthenticated && (
                    <button
                      onClick={() => setReplyOpen((m) => ({ ...m, [c.id]: !m[c.id] }))}
                      className="text-gray-700 hover:underline"
                    >
                      Reply
                    </button>
                  )}
                </div>

                {isAuthenticated && replyOpen[c.id] && (
                  <div className="mt-2 flex items-start gap-2">
                    <textarea
                      value={replyDrafts[c.id] || ''}
                      onChange={(e) => setReplyText(c.id, e.target.value)}
                      placeholder="Write a reply"
                      rows={2}
                      className="min-w-0 flex-1 border rounded p-2 text-xs"
                    />
                    <div className="flex flex-col items-end gap-1">
                      <button
                        onClick={() => submitReply(c.id)}
                        disabled={!!replySubmitting[c.id] || !(replyDrafts[c.id] || '').trim()}
                        className="bg-gray-800 text-white text-xs px-2 py-1 rounded disabled:opacity-50 whitespace-nowrap"
                      >
                        {replySubmitting[c.id] ? 'Replying…' : 'Reply'}
                      </button>
                      <button
                        onClick={() => { setReplyOpen((m) => ({ ...m, [c.id]: false })); setReplyDrafts((m) => ({ ...m, [c.id]: '' })); }}
                        className="text-[11px] text-gray-500 hover:text-gray-700"
                      >
                        Cancel
                      </button>
                      <div className="text-[10px] text-gray-500">{(replyDrafts[c.id] || '').length}/300</div>
                    </div>
                  </div>
                )}

                {Array.isArray(c.replies) && c.replies.length > 0 && (
                  <ul className="mt-3 space-y-3 pl-3 border-l border-gray-200">
                    {c.replies.map((r) => (
                      <li key={r.id} className="">
                        <div className="text-xs text-gray-800 font-medium flex items-center gap-2">
                          <span>{r.user.full_name || r.user.username}</span>
                          {(r.user.is_staff || (r.user.groups || []).includes('Editor') || (r.user.groups || []).includes('Staff')) && (
                            <span title="Staff" className="text-[9px] font-semibold bg-gray-800 text-white px-1.5 py-0.5 rounded-full">STAFF</span>
                          )}
                          {(r.user.groups || []).includes('Editor') && (
                            <span title="Editor" className="text-[9px] font-semibold bg-blue-600 text-white px-1.5 py-0.5 rounded-full">EDITOR</span>
                          )}
                        </div>
                        <div className="text-[10px] text-gray-500">{timeAgo(r.created_date)}</div>
                        <p className="text-sm text-gray-800 mt-1 whitespace-pre-wrap">{r.content}</p>
                        <div className="mt-2 flex items-center gap-3 text-xs">
                          <button
                            onClick={() => toggleCommentLike(r.id)}
                            disabled={!isAuthenticated}
                            className="inline-flex items-center gap-1 text-gray-700 hover:text-red-600 disabled:opacity-50"
                            aria-pressed={!!r.liked_by_me}
                          >
                            {r.liked_by_me ? (
                              <HeartSolid className="h-4 w-4 text-red-600" />
                            ) : (
                              <HeartOutline className="h-4 w-4" />
                            )}
                            <span>{r.like_count ?? 0}</span>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
