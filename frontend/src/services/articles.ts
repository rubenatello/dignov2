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
