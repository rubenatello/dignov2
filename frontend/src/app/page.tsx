'use client';

import { useState, useEffect } from 'react';
import { Article, PaginatedResponse } from '@/lib/types';
import ArticleCard from '@/components/ArticleCard';
import api from '@/lib/api';

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await api.get<PaginatedResponse<Article>>('/articles/');
        setArticles(response.data.results);
      } catch (err) {
        setError('Failed to load articles');
        console.error('Error fetching articles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-accent flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-secondary">Loading articles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-accent flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-secondary mb-4">Oops! Something went wrong</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-accent">
      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-secondary sm:text-5xl md:text-6xl">
              Welcome to{' '}
              <span className="text-primary">Digno</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              Quality journalism that matters. Independent news with integrity and dignity.
            </p>
            <div className="mt-8">
              <button className="bg-cta hover:bg-cta/90 text-secondary px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
                Support Our Mission
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Articles Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-secondary mb-4">Latest Articles</h2>
          <p className="text-gray-600 text-lg">Stay informed with our most recent reporting</p>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium text-secondary mb-2">No articles yet</h3>
            <p className="text-gray-600">Check back soon for our latest content!</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}