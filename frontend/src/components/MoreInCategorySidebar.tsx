"use client";

import Link from "next/link";

type Item = {
  id: number;
  title: string;
  slug: string;
  published_date?: string | null;
};

type Props = {
  label: string;
  items: Item[];
};

export default function MoreInCategorySidebar({ label, items }: Props) {
  return (
    <aside className="lg:col-span-4">
      <div className="sticky top-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-3">More in {label || "this category"}</h2>
        {items.length === 0 ? (
          <div className="text-sm text-slate-500">No related articles found.</div>
        ) : (
          <ul className="space-y-3">
            {items.map((r) => (
              <li key={r.id} className="border-b last:border-b-0 pb-3">
                <Link href={`/articles/${r.slug}`} className="text-slate-800 hover:text-primary font-medium">
                  {r.title}
                </Link>
                {r.published_date && (
                  <div className="text-xs text-slate-500 mt-1">{new Date(r.published_date).toLocaleDateString()}</div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
