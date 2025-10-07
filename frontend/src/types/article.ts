
export type UserRef = {
  id: number;
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  bio?: string;
};

export type FeaturedImageData = {
  url: string;
  caption?: string;
};

export type Article = {
  id: number;
  title: string;
  slug: string;
  content?: string;
  summary: string;
  author: UserRef | string;
  co_author?: UserRef | string | null;
  category: "BREAKING_NEWS"|"ECONOMY"|"POLITICS"|"FOREIGN_AFFAIRS"|"IMMIGRATION"|"HUMAN_RIGHTS"|"LEGISLATION"|"OPINION";
  is_breaking_news: boolean;
  is_published: boolean;
  published_date?: string | null;
  last_published_update?: string | null;
  scheduled_publish_time?: string | null;
  created_date?: string | null;
  updated_date?: string | null;
  view_count?: number;
  tags?: string;
  tags_list?: string[];
  meta_description?: string;
  featured_image?: string | null;
  featured_image_asset?: number | null;
  featured_image_data?: FeaturedImageData | null;
};
