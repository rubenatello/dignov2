'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import api from '../../lib/api';

interface Article {
  id: number;
  title: string;
  summary: string;
  category: string;
  is_breaking_news: boolean;
  author: string;
  published_date: string;
  slug: string;
  featured_image?: string;
}

const mediaOrigin = process.env.NEXT_PUBLIC_MEDIA_ORIGIN || '';
const abs = (url?: string) =>
  url && url.startsWith('/') ? `${mediaOrigin}${url}` : url || '';

const ArticleCard = ({ article }: { article: Article }) => (
  <article className="group cursor-pointer border-b border-gray-200 pb-6 mb-6">
    <div className="flex flex-col md:flex-row gap-4">
      <div className="md:w-1/3">
        <div className="aspect-video bg-gray-200 overflow-hidden rounded-lg">
          {article.featured_image ? (
            <img
              src={abs(article.featured_image)}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
              <span className="text-gray-600 text-sm">No Image</span>
            </div>
          )}
        </div>
      </div>
      <div className="md:w-2/3">
        <div className="flex items-center mb-2">
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
            {article.category ? article.category.replace('_', ' ') : ''}
          </span>
          {article.is_breaking_news && (
            <span className="ml-2 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
              🔥 BREAKING
            </span>
          )}
        </div>
        <h2 className="text-xl font-bold text-black mb-2 group-hover:text-gray-700 transition-colors leading-tight">
          {article.title}
        </h2>
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">{article.summary}</p>
        <div className="flex items-center text-xs text-gray-500">
          <span>By {article.author}</span>
          <span className="mx-2">•</span>
          <span>{new Date(article.published_date).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  </article>
);

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams?.get('q') || '';
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data } = await api.get(`articles/?search=${encodeURIComponent(query)}`);
        const articlesList: Article[] = Array.isArray(data) ? data : (data.results ?? []);
        setArticles(articlesList);
      } catch (err) {
        console.error('Error fetching search results:', err);
        setError('Failed to load search results');
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Searching...</p>
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
          <h2 className="text-2xl font-bold text-red-600 mb-4">Search Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">
            Search Results
          </h1>
          {query && (
            <p className="text-gray-600">
              {articles.length > 0 
                ? `Found ${articles.length} result${articles.length !== 1 ? 's' : ''} for "${query}"`
                : `No results found for "${query}"`
              }
            </p>
          )}
        </div>

        {!query ? (
          <div className="text-center py-16">
            <h2 className="text-xl font-semibold text-gray-600 mb-4">Enter a search term</h2>
            <p className="text-gray-500">Use the search bar above to find articles.</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-xl font-semibold text-gray-600 mb-4">No articles found</h2>
            <p className="text-gray-500">Try different keywords or check your spelling.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {articles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}