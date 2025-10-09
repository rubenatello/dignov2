import type { FeaturedImageData, UserRef } from './article';

export interface ArticleListItem {
  id: number;
  title: string;
  summary: string;
  category: string; // Use plain string for list safety
  is_breaking_news: boolean;
  is_published?: boolean;
  author?: string | UserRef;
  published_date?: string | null;
  slug: string;
  featured_image?: string | null;
  featured_image_data?: FeaturedImageData | null;
}

export function getAuthorName(a?: string | UserRef): string {
  if (!a) return '';
  if (typeof a === 'string') return a;
  return a.full_name || a.username || '';
}
