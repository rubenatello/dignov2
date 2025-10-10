"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { fetchArticlesByCategory } from "@/services/articles";
import type { ArticleListItem } from "@/types/home";
import { fixMediaUrl } from "@/lib/media";

const CATEGORY_SLUG_TO_ENUM: Record<string, string> = {
  "breaking-news": "BREAKING_NEWS",
  economy: "ECONOMY",
  politics: "POLITICS",
  "foreign-affairs": "FOREIGN_AFFAIRS",
  immigration: "IMMIGRATION",
  "human-rights": "HUMAN_RIGHTS",
  legislation: "LEGISLATION",
  opinion: "OPINION",
};

function toTitle(slug: string) {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const categoryEnum = CATEGORY_SLUG_TO_ENUM[slug];

  const [items, setItems] = useState<ArticleListItem[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    async function load() {
      if (!categoryEnum) {
        setError("Unknown category");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const { list, count } = await fetchArticlesByCategory(categoryEnum, page);
        if (!ignore) {
          setItems(list);
          setCount(count);
        }
      } catch (e) {
        console.error(e);
        if (!ignore) setError("Failed to load category articles");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [categoryEnum, page]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(count / 20)), [count]);

  const Title = toTitle(slug);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-black mb-6 border-b-2 border-black pb-2">
          {Title}
        </h1>
        {loading ? (
          <div className="py-16 text-center text-gray-600">Loading…</div>
        ) : error ? (
          <div className="py-16 text-center text-red-600">{error}</div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center text-gray-600">No articles yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((article) => (
              <Link key={article.id} href={`/articles/${article.slug}`} className="group block">
                <article>
                  <div className="aspect-video bg-gray-200 mb-4 overflow-hidden rounded-lg">
                    {article.featured_image || article.featured_image_data?.url ? (
                      <img
                        src={fixMediaUrl(
                          (article.featured_image_data?.url ?? article.featured_image) || ""
                        )}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                        <span className="text-gray-600 text-lg">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center mb-2">
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {article.category ? article.category.replace(/_/g, " ") : ""}
                    </span>
                    {article.is_breaking_news && (
                      <span className="ml-2 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">🔥 BREAKING</span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-black mb-2 group-hover:text-gray-700 transition-colors leading-tight">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">{article.summary}</p>
                  <div className="text-xs text-gray-500">
                    <span>
                      {article.published_date
                        ? new Date(article.published_date).toLocaleDateString()
                        : ""}
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {count > 20 && (
          <div className="flex justify-center items-center gap-4 mt-10">
            <button
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              Prev
            </button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded disabled:opacity-50"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              Next
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
