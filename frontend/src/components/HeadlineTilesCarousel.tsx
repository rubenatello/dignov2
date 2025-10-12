"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { fixMediaUrl } from "@/lib/media";

type Item = {
  id: number;
  slug: string;
  title: string;
  summary?: string;
  featured_image?: string | null;
  featured_image_data?: { url?: string | null } | null;
};

type Props = {
  items: Item[];
  intervalMs?: number; // default 5000
  heightPx?: number; // default 150
};

export default function HeadlineTilesCarousel({ items, intervalMs = 10000, heightPx = 150 }: Props) {
  const list = useMemo(() => items.slice(0, 15), [items]);
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(3); // default mid-range
  const [showSwipeHint, setShowSwipeHint] = useState(true);

  // Responsive visible count (1 on small, 3 on md, 5 on lg+)
  useEffect(() => {
    const calc = () => {
      const w = typeof window !== "undefined" ? window.innerWidth : 1024;
      if (w < 640) return 1;
      if (w < 1024) return 3;
      return 5;
    };
    setVisible(calc());
    const onResize = () => setVisible(calc());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Auto-advance
  useEffect(() => {
    if (list.length <= 1) return;
    const t = window.setInterval(() => setIdx((p) => (p + 1) % Math.max(list.length, 1)), Math.max(2000, intervalMs));
    return () => window.clearInterval(t);
  }, [list.length, intervalMs]);

  // Mobile swipe hint: auto-hide after a few seconds or on first touch
  useEffect(() => {
    const timer = window.setTimeout(() => setShowSwipeHint(false), 4000);
    return () => window.clearTimeout(timer);
  }, []);

  if (list.length === 0) return null;

  const active = list[idx];
  const tileStyle = { height: `${heightPx}px` } as const;

  const next = () => setIdx((p) => (p + 1) % list.length);
  const prev = () => setIdx((p) => (p - 1 + list.length) % list.length);

  const renderTile = (item: Item) => {
    const imageUrl = fixMediaUrl(item.featured_image_data?.url || item.featured_image || "");
    return (
      <Link key={item.id} href={`/articles/${item.slug}`} className="group block">
        {/* Image tile */}
        <div className="relative overflow-hidden rounded-md border border-gray-200" style={tileStyle}>
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-gray-200" />
          )}
          {/* Dim overlay for readability */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
          <div className="absolute bottom-0 left-0 right-0 p-2">
            <h4 className="text-white text-xs sm:text-sm md:text-sm font-semibold line-clamp-2 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
              {item.title}
            </h4>
          </div>
        </div>
        {/* TL;DR under each tile (desktop too) */}
        {item.summary && (
          <div className="mt-1 text-[11px] leading-snug text-slate-700 line-clamp-2">
            <span>{item.summary}</span>
          </div>
        )}
      </Link>
    );
  };

  const visibleItems: Item[] = [];
  for (let i = 0; i < Math.min(visible, list.length); i++) {
    visibleItems.push(list[(idx + i) % list.length]);
  }

  return (
    <div className="w-full mb-8" onTouchStart={() => setShowSwipeHint(false)}>
      <div className="relative">
        {/* Tiles grid */}
        <div className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${Math.min(visible, visibleItems.length)}, minmax(0, 1fr))` }}>
          {visibleItems.map(renderTile)}
        </div>
        {/* Arrows */}
        {list.length > visible && (
          <>
            <button
              aria-label="Previous"
              onClick={prev}
              className="absolute left-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 border border-gray-200 shadow hover:bg-white hidden sm:flex items-center justify-center"
            >
              ‹
            </button>
            <button
              aria-label="Next"
              onClick={next}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 border border-gray-200 shadow hover:bg-white hidden sm:flex items-center justify-center"
            >
              ›
            </button>
          </>
        )}
      </div>
      {/* Mobile swipe hint */}
      {showSwipeHint && (
        <div className="sm:hidden mt-2 text-center text-xs text-gray-500">
          Swipe to see more →
        </div>
      )}
    </div>
  );
}
