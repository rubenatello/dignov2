"use client";

import { fixMediaUrl } from "@/lib/media";

type HeroData = {
  title: string;
  subtitle?: string;
  featured_image?: string | null;
  featured_image_data?: { url?: string; caption?: string };
  summary?: string;
};

export default function ArticleHero({ title, subtitle, featured_image, featured_image_data, summary }: HeroData) {
  const imgSrc = fixMediaUrl(featured_image_data?.url || featured_image || "");
  return (
    <>
      <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">{title}</h1>
      {subtitle && (
        <h2 className="text-xs md:text-sm leading-snug font-normal text-slate-600 mb-2">{subtitle}</h2>
      )}
      {imgSrc ? (
        <figure className="mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imgSrc} alt={title} className="w-full rounded-lg" />
          {featured_image_data?.caption && (
            <figcaption className="text-xs text-slate-500 mt-2 text-center">{featured_image_data.caption}</figcaption>
          )}
        </figure>
      ) : null}
      {summary && (
        <div className="bg-gray-100 border border-gray-200 text-slate-900 text-sm rounded p-3 mb-6">
          <span className="font-semibold mr-2">TL;DR</span>
          <span className="align-middle">{summary}</span>
        </div>
      )}
    </>
  );
}
