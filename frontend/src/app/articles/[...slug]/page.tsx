"use client";

import React, { useEffect, useMemo, useState } from 'react';
import api from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { fixHtmlMediaUrls } from '@/lib/media';
import ArticleEngagement from '@/components/ArticleEngagement';
import MoreInCategorySidebar from '@/components/MoreInCategorySidebar';
import ArticleHero from '@/components/ArticleHero';

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
  like_count?: number;
  comment_count?: number;
  liked_by_me?: boolean;
};

export default function ArticleLivePage() {
  const [leafSlug, setLeafSlug] = useState('');
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // URL pattern: /articles/.../leaf
      const m = window.location.pathname.match(/\/articles\/(.+)$/);
      const full = m?.[1] || '';
      const leaf = full.split('/').filter(Boolean).pop() || '';
      setLeafSlug(leaf);
    }
  }, []);
  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get(`/articles/${leafSlug}/`);
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
        setError('Article not found.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [leafSlug]);

  const categoryLabel = useMemo(() => {
    if (!article?.category) return '';
    return article.category.replace(/_/g, ' ');
  }, [article?.category]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {loading && (
            <div className="text-gray-500">Loading…</div>
          )}
          {!loading && error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">{error}</div>
          )}
          {!loading && article && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Main article */}
              <article className="lg:col-span-8">
                <ArticleHero
                  title={article.title}
                  subtitle={article.subtitle}
                  featured_image={article.featured_image}
                  featured_image_data={(article as any).featured_image_data}
                  summary={article.summary}
                />
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

                {/* Engagement */}
                <ArticleEngagement
                  slug={article.slug}
                  likedByMe={article.liked_by_me}
                  likeCount={article.like_count}
                  commentCount={article.comment_count}
                />
              </article>

              {/* Sidebar feed */}
              <MoreInCategorySidebar label={categoryLabel} items={related} />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
