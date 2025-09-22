'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const menuItems = [
  'BREAKING NEWS',
  'ECONOMY', 
  'POLITICS',
  'FOREIGN AFFAIRS',
  'IMMIGRATION',
  'HUMAN RIGHTS',
  'LEGISLATION',
  'OPINION'
];

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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