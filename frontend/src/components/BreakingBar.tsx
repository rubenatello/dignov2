"use client";
import Link from 'next/link';
import type { ArticleListItem } from '@/types/home';

export default function BreakingBar({ items }: { items: ArticleListItem[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="bg-red-600 text-white px-4 py-2 mb-8 rounded">
      <div className="flex items-center gap-4 overflow-x-auto whitespace-nowrap">
        <span className="font-bold text-xs md:text-sm tracking-wide">BREAKING</span>
        <ul className="flex items-center gap-6">
          {items.slice(0,5).map(item => (
            <li key={item.id} className="text-xs md:text-sm">
              <Link href={`/articles/${item.slug}`} className="hover:underline">
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
