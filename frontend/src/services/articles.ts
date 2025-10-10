import api from "@/lib/api";
import type { Article } from "@/types/article";
import type { ArticleListItem } from "@/types/home";

export async function getArticle(id: string|number) {
  const { data } = await api.get<Article>(`/articles/${id}/`);
  return data;
}

export async function patchArticle(id: string|number, payload: Partial<Article>) {
  const { data } = await api.patch<Article>(`/articles/${id}/`, payload);
  return data;
}

export async function publishArticle(id: string|number) {
  const { data } = await api.post<Article>(`/articles/${id}/publish/`);
  return data;
}

export async function fetchArticlesList(): Promise<ArticleListItem[]> {
  const { data } = await api.get('articles/');
  const list: ArticleListItem[] = Array.isArray(data) ? data : (data.results ?? []);
  return list;
}

export async function fetchBreakingList(): Promise<ArticleListItem[]> {
  const { data } = await api.get('articles/breaking/');
  const list: ArticleListItem[] = Array.isArray(data) ? data : (data.results ?? []);
  return list;
}

// Fetch articles by category (backend expects enum value, e.g., "POLITICS"). Supports server pagination.
export async function fetchArticlesByCategory(category: string, page: number = 1): Promise<{ list: ArticleListItem[]; count: number; next?: string | null; previous?: string | null; }>{
  const { data } = await api.get('articles/', { params: { category, page } });
  const list: ArticleListItem[] = Array.isArray(data) ? data : (data.results ?? []);
  const count: number = typeof data?.count === 'number' ? data.count : list.length;
  const next = data?.next ?? null;
  const previous = data?.previous ?? null;
  return { list, count, next, previous };
}
