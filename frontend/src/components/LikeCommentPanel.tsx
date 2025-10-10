"use client";

import { useEffect, useMemo, useState } from "react";
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
  const totalComments = useMemo(() => commentCount ?? comments.length ?? 0, [commentCount, comments.length]);

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
      setComments((prev) => prev.map((c) => {
        if (c.id !== commentId) return c;
        const liked = !!c.liked_by_me;
        return { ...c, liked_by_me: !liked, like_count: Math.max(0, (c.like_count || 0) + (liked ? -1 : 1)) };
      }));
      const target = comments.find((c) => c.id === commentId);
      if (target?.liked_by_me) {
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
                <div className="text-xs text-gray-500">{new Date(c.created_date).toLocaleString()}</div>
                <p className="text-sm text-gray-800 mt-1 whitespace-pre-wrap">{c.content}</p>
                <div className="mt-2 flex items-center gap-3">
                  <button
                    onClick={() => toggleCommentLike(c.id)}
                    disabled={!isAuthenticated}
                    className={`px-2 py-0.5 rounded border text-xs ${c.liked_by_me ? 'bg-red-50 border-red-300 text-red-700' : 'bg-white border-gray-300 text-gray-700'} disabled:opacity-50`}
                    aria-pressed={!!c.liked_by_me}
                  >
                    {c.liked_by_me ? '♥ Like' : '♡ Like'} ({c.like_count ?? 0})
                  </button>
                  {isAuthenticated && (
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <textarea
                          value={replyDrafts[c.id] || ''}
                          onChange={(e) => setReplyText(c.id, e.target.value)}
                          placeholder="Write a reply"
                          rows={1}
                          className="min-w-0 flex-1 border rounded p-1 text-xs"
                        />
                        <button
                          onClick={() => submitReply(c.id)}
                          disabled={!!replySubmitting[c.id] || !(replyDrafts[c.id] || '').trim()}
                          className="bg-gray-800 text-white text-xs px-2 py-1 rounded disabled:opacity-50 whitespace-nowrap"
                        >
                          {replySubmitting[c.id] ? 'Replying…' : 'Reply'}
                        </button>
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">{(replyDrafts[c.id] || '').length}/300</div>
                    </div>
                  )}
                </div>

                {Array.isArray(c.replies) && c.replies.length > 0 && (
                  <ul className="mt-3 space-y-3 pl-3 border-l">
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
                        <div className="text-[10px] text-gray-500">{new Date(r.created_date).toLocaleString()}</div>
                        <p className="text-sm text-gray-800 mt-1 whitespace-pre-wrap">{r.content}</p>
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
