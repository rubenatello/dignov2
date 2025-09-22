'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

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

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [breakingNews, setBreakingNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/articles/');
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        const data = await response.json();
        setArticles(data.results || data);
        setBreakingNews(data.results?.filter((article: Article) => article.is_breaking_news) || data.filter((article: Article) => article.is_breaking_news));
      } catch (err) {
        setError('Failed to load articles');
        console.error('Error fetching articles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const getArticlesByCategory = (category: string) => {
    return articles.filter(article => article.category === category && article.is_breaking_news === false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Breaking News Banner */}
        {breakingNews.length > 0 && (
          <div className="bg-red-600 text-white px-4 py-2 mb-8">
            <div className="flex items-center">
              <span className="font-bold text-sm mr-3">BREAKING</span>
              <span className="text-sm">{breakingNews[0]?.title || 'Latest updates from our newsroom'}</span>
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading articles...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
            <p className="text-gray-600 mt-2">Using placeholder content...</p>
          </div>
        )}

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Story */}
          <div className="lg:col-span-2">
            <article className="group cursor-pointer">
              <div className="aspect-video bg-gray-200 mb-4 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                  <span className="text-gray-600 text-lg">Featured Image</span>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-black mb-4 group-hover:text-gray-700 transition-colors leading-tight">
                {articles[0]?.title || "Welcome to Digno: Independent Journalism for a New Era"}
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                {articles[0]?.summary || "Bringing you comprehensive coverage of the stories that matter most. Our commitment to factual reporting and investigative journalism keeps you informed about the issues shaping our world."}
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <span>By {articles[0]?.author || "Editorial Team"}</span>
                <span className="mx-2">•</span>
                <span>{articles[0]?.published_date ? new Date(articles[0].published_date).toLocaleDateString() : "September 22, 2025"}</span>
              </div>
            </article>
          </div>

          {/* Sidebar Stories */}
          <div className="space-y-6">
            {articles.slice(1, 4).map((article, index) => (
              <article key={article.id} className="group cursor-pointer">
                <h2 className="text-xl font-bold text-black mb-2 group-hover:text-gray-700 transition-colors">
                  {article.title}
                </h2>
                <p className="text-gray-600 text-sm mb-2">
                  {article.summary}
                </p>
                <div className="text-xs text-gray-500">
                  <span>{new Date(article.published_date).toLocaleDateString()}</span>
                </div>
              </article>
            ))}
            
            {/* Fallback content if no articles */}
            {articles.length === 0 && !loading && (
              <>
                <article className="group cursor-pointer">
                  <h2 className="text-xl font-bold text-black mb-2 group-hover:text-gray-700 transition-colors">
                    Breaking: Major Economic Policy Announced
                  </h2>
                  <p className="text-gray-600 text-sm mb-2">
                    Government officials unveil new economic measures aimed at addressing current market challenges...
                  </p>
                  <div className="text-xs text-gray-500">
                    <span>2 hours ago</span>
                  </div>
                </article>

                <article className="group cursor-pointer">
                  <h2 className="text-xl font-bold text-black mb-2 group-hover:text-gray-700 transition-colors">
                    Immigration Reform: What You Need to Know
                  </h2>
                  <p className="text-gray-600 text-sm mb-2">
                    Comprehensive analysis of proposed immigration policy changes and their potential impact...
                  </p>
                  <div className="text-xs text-gray-500">
                    <span>4 hours ago</span>
                  </div>
                </article>
              </>
            )}
          </div>
        </div>

        {/* News Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <section>
            <h2 className="text-2xl font-bold text-black mb-4 pb-2 border-b-2 border-black">Politics</h2>
            <div className="space-y-4">
              {getArticlesByCategory('POLITICS').slice(0, 3).map((article) => (
                <article key={article.id} className="group cursor-pointer">
                  <h3 className="font-bold text-lg text-black mb-2 group-hover:text-gray-700 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {article.summary}
                  </p>
                </article>
              ))}
              {getArticlesByCategory('POLITICS').length === 0 && (
                <article className="group cursor-pointer">
                  <h3 className="font-bold text-lg text-black mb-2 group-hover:text-gray-700 transition-colors">
                    Legislative Session Highlights
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Key bills and debates from this week's congressional sessions...
                  </p>
                </article>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4 pb-2 border-b-2 border-black">Economy</h2>
            <div className="space-y-4">
              {getArticlesByCategory('ECONOMY').slice(0, 3).map((article) => (
                <article key={article.id} className="group cursor-pointer">
                  <h3 className="font-bold text-lg text-black mb-2 group-hover:text-gray-700 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {article.summary}
                  </p>
                </article>
              ))}
              {getArticlesByCategory('ECONOMY').length === 0 && (
                <article className="group cursor-pointer">
                  <h3 className="font-bold text-lg text-black mb-2 group-hover:text-gray-700 transition-colors">
                    Market Analysis: Weekly Report
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Economic indicators and market trends affecting everyday Americans...
                  </p>
                </article>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4 pb-2 border-b-2 border-black">Opinion</h2>
            <div className="space-y-4">
              {getArticlesByCategory('OPINION').slice(0, 3).map((article) => (
                <article key={article.id} className="group cursor-pointer">
                  <h3 className="font-bold text-lg text-black mb-2 group-hover:text-gray-700 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {article.summary}
                  </p>
                </article>
              ))}
              {getArticlesByCategory('OPINION').length === 0 && (
                <article className="group cursor-pointer">
                  <h3 className="font-bold text-lg text-black mb-2 group-hover:text-gray-700 transition-colors">
                    The Future of Independent Media
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Editorial perspective on the role of independent journalism...
                  </p>
                </article>
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
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