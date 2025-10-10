"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface CommentItem {
  id: number;
  content: string;
  created_date: string;
  user: { id: number; username: string; full_name?: string; is_staff?: boolean; groups?: string[] };
}

export default function LikeCommentPanel({ slug, likedByMe, likeCount, commentCount }: { slug: string; likedByMe?: boolean; likeCount?: number; commentCount?: number }) {
  const { isAuthenticated } = useAuth();
  const [liked, setLiked] = useState(!!likedByMe);
  const [likes, setLikes] = useState(likeCount ?? 0);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        setLoadingComments(true);
        const { data } = await api.get(`/articles/${slug}/comments/`);
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
    if (!newComment.trim()) return;
    try {
      setSubmitting(true);
      const { data } = await api.post(`/articles/${slug}/comments/`, { content: newComment.trim() });
      setComments((prev) => [data, ...prev]);
      setNewComment("");
    } catch (e) {
      // noop
    } finally {
      setSubmitting(false);
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
        <div className="text-sm text-gray-600">Comments ({comments.length || commentCount || 0})</div>
      </div>

      {isAuthenticated ? (
        <div className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full border rounded p-2 text-sm"
            rows={3}
            placeholder="Add a comment"
          />
          <div className="flex justify-end mt-2">
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
          <ul className="space-y-4">
            {comments.map((c) => (
              <li key={c.id} className="border-b pb-3">
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
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
