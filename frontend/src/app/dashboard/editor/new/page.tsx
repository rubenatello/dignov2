"use client";
import StatisticsTab from "./StatisticsTab";
import SeoTab from "./SeoTab";
import PublishingTab from "./PublishingTab";
import ClassificationTab from "./ClassificationTab";
import AuthorsTab from "./AuthorsTab";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useInterval } from "react-use";
import StudioHeader from "../StudioHeader";
import ContentTab from "./ContentTab";
import FeaturedImageTab from "./FeaturedImageTab";
import SaveActions from "../SaveActions";
import Sidebar from "./Sidebar";
import { CATEGORY_CHOICES, authorOptions, coAuthorOptions } from "../functions/options";
import { handleFormChange } from "../functions/formHandlers";
import { SlugConflictDialog } from "@/components/ui/SlugConflictDialog";
import { useArticleSave } from "../functions/useArticleSave";
import type { FormDataState } from "./types";
import { getNext6amET } from "./utils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/Toast";

export default function ArticleWriter() {
  const router = useRouter();
  const { user } = useAuth();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [originalSlug, setOriginalSlug] = useState<string | null>(null);

  // Height of StudioHeader: 72px (mobile), 88px (md+)
  // Add top padding to push content below fixed header
  const [formData, setFormData] = useState<FormDataState>({
    id: "",
    title: "",
    subtitle: "", // NEW FIELD
    slug: "",
    summary: "",
    content: "",
    featured_image: null,
    featured_image_asset: "",
    category: "POLITICS",
    is_breaking_news: false,
    author: "1",
    co_author: "",
    is_published: false,
    published_date: "",
  last_published_update: "",
    scheduled_publish_time: "",
    tags: "",
    meta_description: "",
    view_count: 0,
    created_date: "",
    updated_date: "",
  });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "content" | "featured_image" | "classification" | "authors" | "publishing" | "seo" | "statistics"
  >("content");

  // Back modal
  const [showBackModal, setShowBackModal] = useState(false);
  const handleDiscardAndBack = () => {
    setShowBackModal(false);
    router.push("/dashboard/editor");
  };

  const handleSaveAndBack = async () => {
    setShowBackModal(false);
    await handleSaveAndContinue();
    router.push("/dashboard/editor");
  };

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Change handler (modularized)
  const handleChange = handleFormChange<FormDataState>(setFormData);

  // AUTOSAVE (PUT to existing id)
  const autosave = useCallback(async () => {
    // Only autosave when we know which record to target
    const targetSlug = originalSlug || (formData.slug ? String(formData.slug) : "");
    if (!targetSlug) return;
    try {
      // If sending a file, you likely want FormData() here – left as JSON for parity with your code.
      await api.put(`/articles/${targetSlug}/`, formData);
      // console.log("Autosaved successfully");
    } catch (error) {
      console.error("Autosave failed:", error);
    }
  }, [formData, originalSlug]);

  // every 5 minutes
  useInterval(() => {
    if (formData.id) autosave();
  }, 300000);


  // Modular save actions
  const { handleSave, handleSaveAndAddAnother, handleSaveAndContinue, handleSaveAndGetSlug, slugConflict } = useArticleSave(
    formData,
    setFormData,
    setLoading,
    router,
    originalSlug,
    setOriginalSlug
  );

  // Preview handler: save, then open preview tab
  const handlePreview = async () => {
    setErrorMsg(null);
    const { slug, error } = await handleSaveAndGetSlug();
    if (slug) {
      window.open(`/articles/${slug}`, '_blank');
    } else {
      setErrorMsg(error || 'Unable to preview: could not save or generate slug.');
    }
  };

  const handleDelete = useCallback(async () => {
    const targetSlug = originalSlug || (formData.slug ? String(formData.slug) : "");
    if (!targetSlug) {
      toast("No slug available to delete.", "error");
      return;
    }
    try {
      await api.delete(`/articles/${targetSlug}/`);
      toast("Article deleted.", "success");
      router.push('/dashboard/editor');
    } catch (e: any) {
      console.error('Failed to delete article', e);
      const msg = e?.response?.status === 403 ? 'You do not have permission to delete this article.' : 'Failed to delete article.';
      toast(msg, "error");
    }
  }, [api, originalSlug, formData.slug, router]);

  // Basic router guard (optional)
  useEffect(() => {
    if (!router) {
      console.error("NextRouter is not mounted.");
    }
  }, [router]);

  // Parse query once on mount to capture ?id=
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    setEditingId(id);
  }, []);

  // Load existing article into the form if editingId is present
  useEffect(() => {
    const id = editingId;
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
  const res = await api.get(`/articles/by-id`, { params: { id } });
        const a = res.data;
        if (cancelled) return;
        setFormData((prev) => ({
          ...prev,
          id: String(a.id ?? ""),
          title: a.title ?? "",
          subtitle: a.subtitle ?? "",
          slug: a.slug ?? "",
          summary: a.summary ?? "",
          content: a.content ?? "",
          featured_image: null, // direct upload not round-tripped; keep null
          featured_image_asset: a.featured_image_asset ?? "",
          category: a.category ?? "POLITICS",
          is_breaking_news: Boolean(a.is_breaking_news),
          author: typeof a.author === "object" ? String(a.author.id ?? "1") : (a.author ?? "1"),
          co_author: a.co_author ? String(a.co_author) : "",
          is_published: Boolean(a.is_published),
          published_date: a.published_date ?? "",
          last_published_update: a.last_published_update ?? "",
          scheduled_publish_time: a.scheduled_publish_time ?? "",
          tags: Array.isArray(a.tags_list) ? a.tags_list.join(", ") : "",
          meta_description: a.meta_description ?? "",
          view_count: a.view_count ?? 0,
          created_date: a.created_date ?? "",
          updated_date: a.updated_date ?? "",
        }));
        setOriginalSlug(a.slug ?? null);
      } catch (e: any) {
        console.error("Failed to load article:", e);
        setErrorMsg("Failed to load article.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [editingId]);

  return (
    <>
      {/* Slug conflict dialog */}
      <SlugConflictDialog
        isOpen={slugConflict.isOpen}
        currentSlug={slugConflict.currentSlug}
        title={slugConflict.title}
        onResolve={slugConflict.onResolve}
      />
      {/* Delete confirmation modal (page-level to center reliably) */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center px-4"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-5 max-w-xs w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-base font-semibold mb-2 text-red-700">Delete article?</h2>
            <p className="mb-5 text-gray-600 text-sm">This action cannot be undone.</p>
            <div className="flex gap-2 justify-end">
              <button
                className="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 font-medium"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1.5 rounded bg-red-600 text-white hover:bg-red-700 font-medium"
                onClick={async () => {
                  try {
                    setShowDeleteConfirm(false);
                    await handleDelete();
                  } catch (e) {
                    // toast handled in delete
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <StudioHeader user={{ name: "Admin" }} onBack={() => setShowBackModal(true)} />
  <div className="min-h-screen p-8 flex flex-row gap-12 pt-[88px] md:pt-[104px]" style={{ background: '#eef8feff' }}>
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          loading={loading}
          onSave={handleSave}
          onSaveAndAddAnother={handleSaveAndAddAnother}
          onSaveAndContinue={handleSaveAndContinue}
          slug={formData.slug}
          onPreview={handlePreview}
          previewDisabled={
            !formData.title?.trim() ||
            !formData.summary?.trim() ||
            !formData.content?.replace(/<[^>]+>/g, '').trim() ||
            !formData.author?.trim()
          }
          canDelete={Boolean(formData.id)}
          onDelete={handleDelete}
          onOpenDeleteConfirm={() => setShowDeleteConfirm(true)}
        />
        <main className="flex-1 max-w-3xl mx-auto">
          {errorMsg && (
            <div className="mb-4 p-3 rounded bg-red-100 border border-red-300 text-red-800 text-sm">
              <b>Backend Error:</b> {errorMsg}
            </div>
          )}
          {/* Last updated info */}
          <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
            <span>Last updated:</span>
            <span className="font-medium text-gray-700">
              {(() => {
                const ts = formData.last_published_update || formData.updated_date;
                return ts
                  ? new Date(ts).toLocaleString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "-";
              })()}
            </span>
            <span>by</span>
            <span className="font-semibold text-gray-700">{formData.author || "-"}</span>
          </div>

          {/* Back modal */}
          {showBackModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full relative">
                <h2 className="text-lg font-bold mb-4">Are you sure?</h2>
                <p className="mb-6 text-gray-600">Do you want to leave this page?</p>
                <div className="flex flex-col gap-2">
                  <button
                    className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 font-medium"
                    onClick={handleDiscardAndBack}
                  >
                    Yes, don&apos;t save draft
                  </button>
                  <button
                    className="px-4 py-2 rounded bg-primary text-white hover:bg-primary-dark font-medium"
                    onClick={handleSaveAndBack}
                  >
                    Yes, save draft
                  </button>
                  <button
                    className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-medium mt-2"
                    onClick={() => setShowBackModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <h2 className="text-lg font-bold mb-8 text-slate-800">{formData.id ? "Edit Article" : "Write a New Article"}</h2>

          {/* Main content area, no card/box */}
          <section className="flex flex-col gap-10">
            {activeTab === "content" && (
              <ContentTab formData={formData} setFormData={setFormData} handleChange={handleChange} />
            )}

            {activeTab === "featured_image" && (
              <FeaturedImageTab formData={formData} setFormData={setFormData} handleChange={handleChange} />
            )}

            {activeTab === "classification" && (
              <ClassificationTab formData={formData} handleChange={handleChange} />
            )}

            {activeTab === "authors" && (
              <AuthorsTab formData={formData} handleChange={handleChange} />
            )}

            {activeTab === "publishing" && (
              <PublishingTab
                formData={formData}
                setFormData={setFormData}
                handleChange={handleChange}
                handleSaveAndContinue={handleSaveAndContinue}
                getNext6amET={getNext6amET}
              />
            )}

            {activeTab === "seo" && (
              <SeoTab formData={formData} handleChange={handleChange} setFormData={setFormData} />
            )}

            {activeTab === "statistics" && (
              <StatisticsTab formData={formData} />
            )}
          </section>
        </main>

        {/* SaveActions now in Sidebar */}
      </div>
    </>
  );
}
