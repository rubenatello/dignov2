"use client";

import React, { useEffect, useMemo, useState } from 'react';
import api from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { fixMediaUrl, fixHtmlMediaUrls } from '@/lib/media';

type Article = {
  id: number;
  title: string;
  slug: string;
  content?: string;
  subtitle?: string;
  summary: string;
  category: string;
  is_published: boolean;
  featured_image?: string | null;
  tags?: string;
  tags_list?: string[];
  published_date?: string | null;
  last_published_update?: string | null;
  author?: any;
  co_author?: any;
};

export default function ArticlePreviewPage() {
  const [pathSlug, setPathSlug] = useState('');
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // URL pattern: /articles/preview/:slug
      const m = window.location.pathname.match(/\/articles\/preview\/(.+)$/);
      setPathSlug(m?.[1] || '');
    }
  }, []);
  const slug = pathSlug;
  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get(`/articles/${slug}/`);
        if (cancelled) return;
        const a: Article = res.data;
        setArticle(a);

        // Fetch a small set of published articles for the sidebar
        try {
          const listRes = await api.get('/articles/');
          const items: Article[] = listRes.data.results || listRes.data || [];
          const sameCategory = (items || []).filter(it => it.slug !== a.slug && it.category === a.category).slice(0, 6);
          setRelated(sameCategory);
        } catch (e) {
          // Non-fatal
        }
      } catch (e: any) {
        setError('Article not found or you do not have access.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [slug]);

  const categoryLabel = useMemo(() => {
    if (!article?.category) return '';
    // Map enum keys to readable labels if needed
    return article.category.replace(/_/g, ' ');
  }, [article?.category]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {loading && (
            <div className="text-gray-500">Loading preview…</div>
          )}
          {!loading && error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">{error}</div>
          )}
          {!loading && article && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Main article */}
              <article className="lg:col-span-8">
                {!article.is_published && (
                  <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded mb-4 text-center font-semibold text-sm">
                    Preview Mode: This article is not published
                  </div>
                )}
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">{article.title}</h1>
                {article.subtitle && (
                  <h2 className="text-sm md:text-base font-normal text-slate-600 mb-3">{article.subtitle}</h2>
                )}
                {(() => {
                  const data = (article as any).featured_image_data;
                  const imgSrc = fixMediaUrl(data?.url || article.featured_image || '');
                  return imgSrc ? (
                    <figure className="mb-6">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imgSrc} alt={article.title} className="w-full rounded-lg" />
                      {data?.caption && (
                        <figcaption className="text-xs text-slate-500 mt-2 text-center">{data.caption}</figcaption>
                      )}
                    </figure>
                  ) : null;
                })()}
                {article.summary && (
                  <div className="bg-gray-100 border border-gray-200 text-slate-900 text-sm rounded p-3 mb-6">
                    <span className="font-semibold mr-2">TL;DR</span>
                    <span className="align-middle">{article.summary}</span>
                  </div>
                )}
                {/* Byline and dates */}
                <div className="mb-6 text-sm text-slate-600 flex flex-wrap items-center gap-x-3 gap-y-1">
                  {(() => {
                    const nameOf = (p: any): string => {
                      if (!p) return '';
                      if (typeof p === 'string') return p;
                      return p.full_name || [p.first_name, p.last_name].filter(Boolean).join(' ') || p.username || '';
                    };
                    const a = nameOf(article.author);
                    const co = nameOf(article.co_author);
                    return (
                      <>
                        {(a || co) && (
                          <span>
                            By {a}{co ? ` and ${co}` : ''}
                          </span>
                        )}
                        {article.published_date && (
                          <span>Published {new Date(article.published_date).toLocaleDateString()}</span>
                        )}
                        {article.last_published_update && (
                          <span>Updated {new Date(article.last_published_update).toLocaleString()}</span>
                        )}
                      </>
                    );
                  })()}
                </div>
                {article.content && (
                  <div className="prose rte-content max-w-none" dangerouslySetInnerHTML={{ __html: fixHtmlMediaUrls(article.content) }} />
                )}
                <div className="mt-6 text-sm text-slate-500 flex flex-wrap gap-3">
                  <span className="uppercase tracking-wide text-slate-600">Category:</span>
                  <span>{categoryLabel}</span>
                  {Array.isArray(article.tags_list) && article.tags_list.length > 0 && (
                    <>
                      <span className="uppercase tracking-wide text-slate-600">Tags:</span>
                      <span>{article.tags_list.join(', ')}</span>
                    </>
                  )}
                </div>
              </article>

              {/* Sidebar feed */}
              <aside className="lg:col-span-4">
                <div className="sticky top-6">
                  <h2 className="text-lg font-semibold text-slate-800 mb-3">
                    More in {categoryLabel || 'this category'}
                  </h2>
                  {related.length === 0 ? (
                    <div className="text-sm text-slate-500">No related articles found.</div>
                  ) : (
                    <ul className="space-y-3">
                      {related.map((r) => (
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
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
