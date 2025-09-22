'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import RichTextEditor from '@/components/RichTextEditor';
import api from '@/lib/api';

interface ArticleForm {
  title: string;
  summary: string;
  content: string;
  tags: string;
  meta_description: string;
  is_published: boolean;
}

export default function EditorPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState(false);

  const [article, setArticle] = useState<ArticleForm>({
    title: '',
    summary: '',
    content: '',
    tags: '',
    meta_description: '',
    is_published: false,
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleInputChange = (field: keyof ArticleForm, value: string | boolean) => {
    setArticle(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveDraft = async () => {
    setSaving(true);
    try {
      const response = await api.post('/articles/', {
        ...article,
        is_published: false
      });
      setMessage('Draft saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save draft:', error);
      setMessage('Failed to save draft');
    } finally {
      setSaving(false);
    }
  };

  const publishArticle = async () => {
    if (!article.title || !article.summary || !article.content) {
      setMessage('Please fill in title, summary, and content before publishing');
      return;
    }

    setSaving(true);
    try {
      const response = await api.post('/articles/', {
        ...article,
        is_published: true
      });
      setMessage('Article published successfully!');
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error) {
      console.error('Failed to publish article:', error);
      setMessage('Failed to publish article');
    } finally {
      setSaving(false);
    }
  };

  const wordCount = article.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-accent flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-accent">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-secondary">Article Editor</h1>
              <span className="text-sm text-gray-500">
                Welcome, {user?.full_name || user?.username}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {wordCount} words
              </span>
              
              <button
                onClick={() => setPreview(!preview)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                {preview ? 'Edit' : 'Preview'}
              </button>
              
              <button
                onClick={saveDraft}
                disabled={saving}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Draft'}
              </button>
              
              <button
                onClick={publishArticle}
                disabled={saving}
                className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
              >
                {saving ? 'Publishing...' : 'Publish'}
              </button>
              
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-2 text-center">
          {message}
        </div>
      )}

      {/* Editor */}
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {!preview ? (
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-secondary mb-2">
                Article Title *
              </label>
              <input
                type="text"
                id="title"
                value={article.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary text-lg"
                placeholder="Enter article title..."
              />
            </div>

            {/* Summary */}
            <div>
              <label htmlFor="summary" className="block text-sm font-medium text-secondary mb-2">
                Summary *
              </label>
              <textarea
                id="summary"
                rows={3}
                value={article.summary}
                onChange={(e) => handleInputChange('summary', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Brief summary of the article (max 300 characters)..."
                maxLength={300}
              />
              <p className="text-xs text-gray-500 mt-1">
                {article.summary.length}/300 characters
              </p>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Content *
              </label>
              <RichTextEditor
                content={article.content}
                onChange={(content) => handleInputChange('content', content)}
                placeholder="Start writing your article..."
              />
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-secondary mb-2">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                value={article.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="politics, economy, technology (comma-separated)"
              />
            </div>

            {/* Meta Description */}
            <div>
              <label htmlFor="meta_description" className="block text-sm font-medium text-secondary mb-2">
                Meta Description (SEO)
              </label>
              <textarea
                id="meta_description"
                rows={2}
                value={article.meta_description}
                onChange={(e) => handleInputChange('meta_description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Brief description for search engines (max 160 characters)..."
                maxLength={160}
              />
              <p className="text-xs text-gray-500 mt-1">
                {article.meta_description.length}/160 characters
              </p>
            </div>
          </div>
        ) : (
          /* Preview Mode */
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold text-secondary mb-4">{article.title || 'Untitled Article'}</h1>
            <p className="text-lg text-gray-600 mb-6">{article.summary}</p>
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: article.content || '<p>No content yet...</p>' }}
            />
            {article.tags && (
              <div className="mt-8 pt-4 border-t">
                <div className="flex flex-wrap gap-2">
                  {article.tags.split(',').map((tag, index) => (
                    <span
                      key={index}
                      className="bg-accent text-secondary text-sm px-3 py-1 rounded-full"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}