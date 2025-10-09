"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";

type ListItem = {
  id: number;
  title: string;
  slug: string;
  category?: string;
  published_date?: string | null;
  view_count?: number;
  score?: number;
};

type TagItem = { tag: string; count: number };

type Props = {
  defaultDays?: number;
  defaultLimit?: number;
};

export default function Analytics({ defaultDays = 30, defaultLimit = 5 }: Props) {
  const [days, setDays] = useState(defaultDays);
  const [limit, setLimit] = useState(defaultLimit);
  const [loading, setLoading] = useState(false);
  const [topViewed, setTopViewed] = useState<ListItem[]>([]);
  const [trending, setTrending] = useState<ListItem[]>([]);
  const [topTags, setTopTags] = useState<TagItem[]>([]);

  const pageSizeOptions = [5, 10, 15];
  const dayOptions = [7, 14, 30, 90];

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const [tv, tr, tg] = await Promise.all([
          api.get(`/articles/analytics/top-viewed?days=${days}&limit=${limit}`),
          api.get(`/articles/analytics/trending?days=${days}&limit=${limit}`),
          api.get(`/articles/analytics/tags?days=${days}&limit=${limit}`),
        ]);
        if (cancelled) return;
        setTopViewed(tv.data || []);
        setTrending(tr.data || []);
        setTopTags(tg.data || []);
      } catch (e) {
        // Non-fatal; keep UI visible
        console.error("Failed to load analytics", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [days, limit]);

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-slate-800">Analytics</h3>
        <div className="flex items-center gap-3 text-sm">
          <label className="flex items-center gap-1">
            <span className="text-slate-600">Days:</span>
            <select value={days} onChange={(e) => setDays(parseInt(e.target.value))} className="border rounded px-2 py-1">
              {dayOptions.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </label>
          <label className="flex items-center gap-1">
            <span className="text-slate-600">Page size:</span>
            <select value={limit} onChange={(e) => setLimit(parseInt(e.target.value))} className="border rounded px-2 py-1">
              {pageSizeOptions.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
        </div>
      </div>

      {loading && (
        <div className="text-slate-500">Loading metrics…</div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Top Viewed */}
          <div className="bg-white rounded-lg border shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-slate-800">Top Viewed</h4>
              <span className="text-[10px] uppercase tracking-wider text-slate-400">Last {days} days</span>
            </div>
            {topViewed.length === 0 ? (
              <div className="text-sm text-slate-500">No data</div>
            ) : (
              <ul className="space-y-3">
                {(() => {
                  const maxViews = Math.max(...topViewed.map(v => v.view_count || 0), 1);
                  return topViewed.map((a) => {
                    const pct = Math.round(100 * (a.view_count || 0) / maxViews);
                    return (
                      <li key={a.id} className="text-sm">
                        <div className="flex items-center justify-between gap-2">
                          <Link href={`/articles/${a.slug}`} className="text-primary hover:underline flex-1 min-w-0 truncate">{a.title}</Link>
                          <span className="text-xs text-slate-500 whitespace-nowrap">{(a.view_count ?? 0).toLocaleString()} views</span>
                        </div>
                        <div className="mt-1 h-1.5 rounded bg-slate-100 overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: `${pct}%` }} />
                        </div>
                      </li>
                    );
                  });
                })()}
              </ul>
            )}
          </div>

          {/* Trending */}
          <div className="bg-white rounded-lg border shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-slate-800">Trending</h4>
              <span className="text-[10px] uppercase tracking-wider text-slate-400">Score = views / days</span>
            </div>
            {trending.length === 0 ? (
              <div className="text-sm text-slate-500">No data</div>
            ) : (
              <ol className="space-y-2 list-decimal list-inside">
                {trending.map((a) => (
                  <li key={a.id} className="text-sm">
                    <Link href={`/articles/${a.slug}`} className="text-primary hover:underline">{a.title}</Link>
                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Score {a.score}</span>
                      <span className="opacity-70">{(a.view_count ?? 0).toLocaleString()} views</span>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>

          {/* Hot Tags */}
          <div className="bg-white rounded-lg border shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-slate-800">Hot Tags</h4>
              <span className="text-[10px] uppercase tracking-wider text-slate-400">Top {limit}</span>
            </div>
            {topTags.length === 0 ? (
              <div className="text-sm text-slate-500">No data</div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {topTags.map(t => (
                  <span key={t.tag} className="px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-800 border border-blue-200">
                    {t.tag} <span className="opacity-70">× {t.count}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
