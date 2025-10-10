"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
};

export default function HeadlineSummaryCarousel({ items, intervalMs = 5000 }: Props) {
  const list = useMemo(() => items.slice(0, 8), [items]);
  const [idx, setIdx] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (list.length <= 1) return;
    timerRef.current && window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setIdx((prev) => (prev + 1) % list.length);
    }, Math.max(2000, intervalMs));
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [list.length, intervalMs]);

  if (list.length === 0) return null;

  const active = list[idx];
  const imageUrl = fixMediaUrl(active.featured_image_data?.url || active.featured_image || "");

  return (
    <div className="w-full mb-8 rounded-xl overflow-hidden border border-gray-200 bg-white">
      <Link href={`/articles/${active.slug}`} className="block group">
        <div className="relative aspect-[16/7] bg-gray-100">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt={active.title} className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 w-full h-full bg-gray-200" />
          )}
          {/* Dark gradient overlay for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          {/* Headline */}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
            <h3 className="text-white text-xl md:text-2xl font-bold drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
              {active.title}
            </h3>
          </div>
        </div>
      </Link>
      {/* TL;DR summary below image */}
      {active.summary && (
        <div className="p-4 md:p-5 bg-background">
          <div className="text-sm text-slate-800">
            <span className="font-semibold mr-2">TL;DR</span>
            <span className="align-middle">{active.summary}</span>
          </div>
        </div>
      )}
      {/* Dots navigation */}
      {list.length > 1 && (
        <div className="flex items-center gap-2 px-4 pb-4">
          {list.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIdx(i)}
              className={`h-2.5 w-2.5 rounded-full transition ${i === idx ? "bg-primary" : "bg-gray-300 hover:bg-gray-400"}`}
            />)
          )}
        </div>
      )}
    </div>
  );
}
