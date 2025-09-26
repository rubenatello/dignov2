import { api } from "@/lib/axios";
import type { ImageAsset } from "@/types/image";

export async function uploadImage(form: FormData): Promise<ImageAsset> {
  const { data } = await api.post<ImageAsset>("/images/", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function listImages(q = "", page = 1) {
  const { data } = await api.get<{results: ImageAsset[]; next: string|null; count: number}>(`/images/`, {
    params: { q, page },
  });
  return data;
}
