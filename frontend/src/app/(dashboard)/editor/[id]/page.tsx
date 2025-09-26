"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CkEditorClient from "@/components/editor/CkEditorClient";
import SeoPanel from "@/components/editor/SeoPanel";
import FeaturedImagePicker from "@/components/editor/FeaturedImagePicker";
import TagInput from "@/components/editor/TagInput";
import { getArticle, patchArticle } from "@/services/articles";
import type { Article } from "@/types/article";

export default function EditorPage() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id");
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getArticle(id).then(setArticle).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading…</div>;
  if (!article) return <div>Article not found</div>;

  function handleFieldChange(fields: Partial<Article>) {
    setArticle(a => a ? { ...a, ...fields } : a);
    if (article?.id) patchArticle(article.id, fields);
  }

  return (
    <div className="flex gap-8">
      <div className="flex-1">
        <CkEditorClient articleId={article.id} initialHTML={article.content} />
      </div>
      <div className="w-96">
        <SeoPanel
          summary={article.summary}
          metaDescription={article.meta_description}
          tags={article.tags}
          onChange={fields => handleFieldChange(fields)}
        />
        <TagInput value={article.tags} onChange={tags => handleFieldChange({ tags })} />
        <FeaturedImagePicker value={article.featured_image_asset} onChange={img => handleFieldChange({ featured_image_asset: img.id })} />
      </div>
    </div>
  );
}
