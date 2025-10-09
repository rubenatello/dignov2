
'use client';
import React from 'react';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../lib/api'; // <-- use the axios client
import { fixMediaUrl } from '@/lib/media';
import { fetchArticlesList, fetchBreakingList } from '@/services/articles';
import BreakingBar from '@/components/BreakingBar';
import type { ArticleListItem } from '@/types/home';

type Article = ArticleListItem;

// (Optional) If Django returns relative media paths like "/media/…"
// set NEXT_PUBLIC_MEDIA_ORIGIN (e.g. http://localhost:8000) or ignore this if your API already returns absolute URLs.
const abs = (url?: string) => fixMediaUrl(url || '');


const ArticleCard = ({ article }: { article: Article }) => {
  const authorName = (() => {
    const a = article.author;
    if (!a) return '';
    if (typeof a === 'string') return a;
    return a.full_name || a.username || '';
  })();
  return (
    <Link href={`/articles/${article.slug}`} className="group cursor-pointer block">
      <article>
        <div className="aspect-video bg-gray-200 mb-4 overflow-hidden rounded-lg">
          {article.featured_image || article.featured_image_data?.url ? (
            <img
              src={abs((article.featured_image_data?.url ?? article.featured_image) || undefined)}
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
            {article.category ? article.category.replace(/_/g, ' ') : ''}
          </span>
          {article.is_breaking_news && (
            <span className="ml-2 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
              🔥 BREAKING
            </span>
          )}
        </div>
        <h3 className="article-title text-xl font-bold text-black mb-2 group-hover:text-gray-700 transition-colors leading-tight">
          {article.title}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">{article.summary}</p>
        <div className="flex items-center text-xs text-gray-500">
          <span>By {authorName}</span>
          <span className="mx-2">•</span>
          <span>{article.published_date ? new Date(article.published_date).toLocaleDateString() : ''}</span>
        </div>
      </article>
    </Link>
  );
};

const BreakingNewsBanner = ({ breakingNews }: { breakingNews: Article[] }) => (
  breakingNews.length > 0 ? (
    <div className="bg-red-600 text-white px-4 py-2 mb-8 rounded">
      <div className="flex items-center gap-4 overflow-x-auto whitespace-nowrap">
        <span className="font-bold text-xs md:text-sm tracking-wide">BREAKING</span>
        <ul className="flex items-center gap-6">
          {breakingNews.slice(0,5).map(item => (
            <li key={item.id} className="text-xs md:text-sm">
              <Link href={`/articles/${item.slug}`} className="hover:underline">
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  ) : null
);

const FeaturedArticle = ({ article }: { article?: Article }) => (
  article ? (
    <ArticleCard article={article} />
  ) : (
    <article className="group cursor-pointer">
      <div className="aspect-video bg-gray-200 mb-4 overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
          <span className="text-gray-600 text-lg">Featured Image</span>
        </div>
      </div>
      <h1 className="article-title text-3xl md:text-4xl font-bold text-black mb-4 group-hover:text-gray-700 transition-colors leading-tight">
        Welcome to Digno: Independent Journalism for a New Era
      </h1>
      <p className="text-gray-600 text-lg leading-relaxed mb-4">
        Bringing you comprehensive coverage of the stories that matter most. Our commitment to factual reporting and investigative journalism keeps you informed about the issues shaping our world.
      </p>
      <div className="flex items-center text-sm text-gray-500">
        <span>By Editorial Team</span>
        <span className="mx-2">•</span>
        <span>September 22, 2025</span>
      </div>
    </article>
  )
);

const ArticleList = ({ articles }: { articles: Article[] }) => (
  <div className="space-y-6">
    {articles.map(article => (
      <Link key={article.id} href={`/articles/${article.slug}`} className="group cursor-pointer block">
        <article>
          <div className="flex items-center mb-2">
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
              {article.category ? article.category.replace(/_/g, ' ') : ''}
            </span>
            {article.is_breaking_news && (
              <span className="ml-2 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
                🔥 BREAKING
              </span>
            )}
          </div>
          <h2 className="article-title text-xl font-bold text-black mb-2 group-hover:text-gray-700 transition-colors">
            {article.title}
          </h2>
          <p className="text-gray-600 text-sm mb-2">{article.summary}</p>
          <div className="text-xs text-gray-500">
            <span>{article.published_date ? new Date(article.published_date).toLocaleDateString() : ''}</span>
          </div>
        </article>
      </Link>
    ))}
  </div>
);

const CategorySection = ({ title, category, articles }: { title: string, category: string, articles: Article[] }) => (
  <section>
    <h2 className="text-2xl font-bold text-black mb-4 pb-2 border-b-2 border-black">
      {title}
    </h2>
    <div className="space-y-4">
      {articles.filter(a => a.category === category).map(article => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  </section>
);


export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [breakingNews, setBreakingNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const [articlesList, breakingServer] = await Promise.all([
          fetchArticlesList(),
          fetchBreakingList().catch(() => [])
        ]);
        // Ensure only published and sort by most recent publish date
        const published = articlesList.filter(a => (a as any).is_published !== false);
        const sorted = published.sort((a, b) => {
          const da = a.published_date ? new Date(a.published_date).getTime() : 0;
          const db = b.published_date ? new Date(b.published_date).getTime() : 0;
          return db - da;
        });
        setArticles(sorted);

        // Use server-provided breaking when available, else fallback to client-side 12h window
        let breaking: Article[] = breakingServer as Article[];
        if (!breaking || breaking.length === 0) {
          const twelveHoursMs = 12 * 60 * 60 * 1000;
          const now = Date.now();
          breaking = sorted.filter(a => a.is_breaking_news && a.published_date && (now - new Date(a.published_date).getTime()) <= twelveHoursMs).slice(0,5);
        }
        setBreakingNews(breaking);
      } catch (err) {
        console.error('Error fetching articles:', err);
        setError('Failed to load articles');
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const getFeaturedArticle = () =>
    articles.find(a => !a.is_breaking_news) || articles[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading articles...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Articles</h2>
          <p className="text-gray-600">{error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  const featuredArticle = getFeaturedArticle();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
  <BreakingBar items={breakingNews} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <FeaturedArticle article={featuredArticle} />
          </div>
          <ArticleList articles={articles.slice(1, 4)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <CategorySection title="Politics" category="POLITICS" articles={articles} />
          <CategorySection title="Economy" category="ECONOMY" articles={articles} />
          <CategorySection title="Opinion" category="OPINION" articles={articles} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
