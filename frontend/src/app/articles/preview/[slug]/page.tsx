import { studioAPI } from '../../../../lib/api';
import { notFound } from 'next/navigation';
import React from 'react';

export default async function ArticlePreviewPage({ params }: { params: { slug: string } }) {
  // Fetch the draft article by slug
  let article;
  try {
    article = await studioAPI.getArticle(params.slug);
  } catch {
    return notFound();
  }
  if (!article) return notFound();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-3xl mx-auto py-12 px-4">
        <div className="mb-6">
          <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded mb-4 text-center font-semibold text-sm">
            Preview Mode: This article is not published
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">{article.title}</h1>
          <div className="text-lg text-slate-600 mb-4">{article.summary}</div>
          {article.featured_image && (
            <img src={article.featured_image} alt={article.title} className="w-full rounded-lg mb-6" />
          )}
        </div>
        <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
        <div className="mt-8 text-sm text-slate-500">Category: {article.category} | Tags: {article.tags}</div>
      </div>
    </div>
  );
}
