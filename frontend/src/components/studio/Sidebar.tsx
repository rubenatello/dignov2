import React, { useEffect, useState } from "react";
import { studioAPI, User } from "../../lib/api";

interface SidebarProps {
  category: string;
  setCategory: (v: string) => void;
  tags: string;
  setTags: (v: string) => void;
  authorId?: number | null;
  setAuthorId?: (id: number | null) => void;
  coAuthorId?: number | null;
  setCoAuthorId?: (id: number | null) => void;
  history?: { message: string; ts: string }[];
  children?: React.ReactNode;
}

export default function Sidebar({ 
  category, setCategory, 
  tags, setTags,
  authorId, setAuthorId,
  coAuthorId, setCoAuthorId,
  history = [],
  children
}: SidebarProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingUsers(true);
        const data = await studioAPI.getUsers();
        if (mounted) setUsers(data);
      } catch (e) {
        // silent
      } finally {
        if (mounted) setLoadingUsers(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <aside className="w-72 p-5 bg-gradient-to-b from-gray-50 to-white/60 border-r min-h-screen sticky top-0 flex flex-col gap-6 overflow-y-auto">
      {/* Logo at top */}
      <div className="flex items-center justify-center mb-4">
        <img src="/logo.png" alt="Logo" className="h-8 w-auto" style={{objectFit: 'contain'}} />
      </div>
      <div className="space-y-5">
        {/* Category */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Category</label>
            <select 
              className="w-full rounded-lg border border-gray-200 bg-white/70 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400" 
              value={category} 
              onChange={e => setCategory(e.target.value)}
            >
              <option value="">Select category</option>
              <option value="BREAKING_NEWS">Breaking News</option>
              <option value="ECONOMY">Economy</option>
              <option value="POLITICS">Politics</option>
              <option value="FOREIGN_AFFAIRS">Foreign Affairs</option>
              <option value="IMMIGRATION">Immigration</option>
              <option value="HUMAN_RIGHTS">Human Rights</option>
              <option value="LEGISLATION">Legislation</option>
              <option value="OPINION">Opinion</option>
            </select>
        </div>


        {/* Author */}
        {setAuthorId && (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Author</label>
            <select
              className="w-full rounded-lg border border-gray-200 bg-white/70 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
              value={authorId ?? ''}
              onChange={e => setAuthorId(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">Select author</option>
              {loadingUsers && <option>Loading...</option>}
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.first_name || u.username} {u.last_name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Co-Author */}
        {setCoAuthorId && (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Co-Author</label>
            <select
              className="w-full rounded-lg border border-gray-200 bg-white/70 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
              value={coAuthorId ?? ''}
              onChange={e => setCoAuthorId(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">None</option>
              {loadingUsers && <option>Loading...</option>}
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.first_name || u.username} {u.last_name}</option>
              ))}
            </select>
          </div>
        )}

        {/* History Log */}
        {history.length > 0 && (
          <div className="pt-2 border-t border-gray-200">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">History</div>
            <ul className="space-y-1 max-h-40 overflow-y-auto pr-1 text-[11px] leading-snug text-gray-600">
              {history.slice(-15).reverse().map((h, i) => (
                <li key={i} className="flex flex-col">
                  <span>{h.message}</span>
                  <span className="text-[10px] text-gray-400">{new Date(h.ts).toLocaleTimeString()}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {children}
    </aside>
  );
}
