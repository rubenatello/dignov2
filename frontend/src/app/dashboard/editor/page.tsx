"use client";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import type { Article } from "@/types/article";

function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);
  // TODO: Replace with real user data
  const user = { name: "Admin", role: "Editor" };
  return (
    <div className="relative" ref={ref}>
      <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100" onClick={() => setOpen(v => !v)}>
        <span className="inline-block w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-lg font-bold">A</span>
        <span className="hidden md:inline text-sm font-medium">{user.name}</span>
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="#555" strokeWidth="2" d="M6 9l6 6 6-6"/></svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-10">
          <div className="px-4 py-2 text-sm text-gray-700">Signed in as <b>{user.name}</b></div>
          <div className="px-4 py-2 text-xs text-gray-500">Role: {user.role}</div>
          <hr />
          <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">Profile</button>
          <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">Sign out</button>
        </div>
      )}
    </div>
  );
}

export default function EditorListPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/articles/")
      .then(res => res.json())
      .then(data => setArticles(data.results || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b shadow-sm">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Digno Logo" className="h-12 w-auto" />
          <span className="font-roboto text-2xl font-regular text-secondary">Studio</span>
        </div>
        <ProfileDropdown />
      </header>

      <main className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Articles</h2>
          <Link
            href="/dashboard/editor/new"
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary transition no-underline"
            style={{ color: 'var(--white)', textDecoration: 'none' }}
          >
            Add Article
          </Link>
        </div>
        {loading ? <div>Loading…</div> : (
          <div className="overflow-x-auto rounded-xl shadow border bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-gray-600">ID</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-600">Title</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-600">Category</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-600">Breaking</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-600">Author</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-600">Co-Author</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-600">Status</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-600">Published date</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-600">View count</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-600">Created date</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {articles.map(a => (
                  <tr key={a.id} className="border-t hover:bg-gray-50">
                    <td className="px-3 py-2 font-mono text-blue-700 font-bold">{a.id}</td>
                    <td className="px-3 py-2">{a.title}</td>
                    <td className="px-3 py-2">{a.category}</td>
                    <td className="px-3 py-2">
                      {a.is_breaking_news ? (
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold">🔥 BREAKING</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-3 py-2">{typeof a.author === 'string' ? a.author : (a.author?.full_name || a.author?.username || '-')}</td>
                    <td className="px-3 py-2">{a.co_author ? (typeof a.co_author === 'string' ? a.co_author : (a.co_author?.full_name || a.co_author?.username || '-')) : '-'}</td>
                    <td className="px-3 py-2">
                      {a.is_published ? (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">PUBLISHED</span>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">DRAFT</span>
                      )}
                    </td>
                    <td className="px-3 py-2">{a.published_date ? a.published_date : '-'}</td>
                    <td className="px-3 py-2">{a.view_count ?? '-'}</td>
                    <td className="px-3 py-2">{a.created_date ?? '-'}</td>
                    <td className="px-3 py-2">
                      <Link
                        href={`/dashboard/editor/${a.id}`}
                        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary transition no-underline"
                        style={{ color: 'var(--white)', textDecoration: 'none' }}
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
