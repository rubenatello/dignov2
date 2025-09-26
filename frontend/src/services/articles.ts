import { api } from "@/lib/axios";
import type { Article } from "@/types/article";

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
