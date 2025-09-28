// Types for ArticleWriter and related components

export type NullableFile = File | null;

export type FormDataState = {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  summary: string;
  content: string;
  featured_image: NullableFile;
  featured_image_asset: string;
  category: string;
  is_breaking_news: boolean;
  author: string;
  co_author: string;
  is_published: boolean;
  published_date: string;
  scheduled_publish_time: string;
  tags: string;
  meta_description: string;
  view_count: number;
  created_date: string;
  updated_date: string;
};
