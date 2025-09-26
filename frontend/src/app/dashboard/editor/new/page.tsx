"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
// @ts-ignore
import axios from "axios";
import { useInterval } from "react-use";
import StudioHeader from "../StudioHeader";
import RichTextEditor from "../RichTextEditor";
import ImagePicker from "../ImagePicker";
import SaveActions from "../SaveActions";
import SidebarTabs from "../SidebarTabs";

type NullableFile = File | null;

type FormDataState = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  featured_image: NullableFile;
  featured_image_asset: string; // id as string
  category: string;
  is_breaking_news: boolean;
  author: string; // id as string
  co_author: string; // id as string (optional -> empty)
  is_published: boolean;
  published_date: string; // datetime-local string
  scheduled_publish_time: string; // datetime-local string
  tags: string;
  meta_description: string;
  view_count: number;
  created_date: string;
  updated_date: string;
};

const CATEGORY_CHOICES = [
  { value: "BREAKING_NEWS", label: "Breaking News" },
  { value: "ECONOMY", label: "Economy" },
  { value: "POLITICS", label: "Politics" },
  { value: "FOREIGN_AFFAIRS", label: "Foreign Affairs" },
  { value: "IMMIGRATION", label: "Immigration" },
  { value: "HUMAN_RIGHTS", label: "Human Rights" },
  { value: "LEGISLATION", label: "Legislation" },
  { value: "OPINION", label: "Opinion" },
] as const;

export default function ArticleWriter() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormDataState>({
    id: "",
    title: "",
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

  // Stubbed selects (replace with real options when wired to backend)
  const authorOptions = [{ value: "1", label: "Admin" }];
  const coAuthorOptions = [
    { value: "", label: "None" },
    // ...
  ];
  const imageAssetOptions = [
    { value: "", label: "None" },
    // ...
  ];

  // Change handlers
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, type } = target;

    // Checkbox
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: (target as HTMLInputElement).checked }));
      return;
    }

    // File
    if (type === "file") {
      const files = (target as HTMLInputElement).files;
      const file = files && files.length > 0 ? files[0] : null;
      setFormData((prev) => ({ ...prev, [name]: file }));
      return;
    }

    // Default text/select
    setFormData((prev) => ({ ...prev, [name]: target.value }));
  };

  // AUTOSAVE (PUT to existing id)
  const autosave = useCallback(async () => {
    if (!formData.id) return;
    try {
      // If sending a file, you likely want FormData() here – left as JSON for parity with your code.
      await axios.put(`/api/articles/${formData.id}/`, formData);
      // console.log("Autosaved successfully");
    } catch (error) {
      console.error("Autosave failed:", error);
    }
  }, [formData]);

  // every 5 minutes
  useInterval(() => {
    if (formData.id) autosave();
  }, 300000);

  // SAVE actions
  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/articles/", formData);
      const articleId = response.data?.id;
      if (articleId) {
        router.push(`/dashboard/editor/${articleId}`);
      }
    } catch (error) {
      console.error("Error creating article:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndAddAnother = async () => {
    setLoading(true);
    try {
      await axios.post("/api/articles/", formData);
      // reset
      setFormData({
        id: "",
        title: "",
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
        scheduled_publish_time: "",
        tags: "",
        meta_description: "",
        view_count: 0,
        created_date: "",
        updated_date: "",
      });
      setActiveTab("content");
    } catch (error) {
      console.error("Error creating article:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndContinue = async () => {
    setLoading(true);
    try {
      let response;
      if (formData.id) {
        response = await axios.put(`/api/articles/${formData.id}/`, formData);
      } else {
        response = await axios.post("/api/articles/", formData);
        const newId = response?.data?.id ?? "";
        if (newId) setFormData((prev) => ({ ...prev, id: newId }));
      }
      // show toast here if you have a toaster
    } catch (error) {
      console.error("Error saving article:", error);
    } finally {
      setLoading(false);
    }
  };

  // Basic router guard (optional)
  useEffect(() => {
    if (!router) {
      console.error("NextRouter is not mounted.");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-row gap-8">
      <div className="w-64 flex-shrink-0">
        <SidebarTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <div className="flex-1 max-w-3xl mx-auto">

        <StudioHeader user={{ name: "Admin" }} onBack={() => setShowBackModal(true)} />

        {/* Last updated info */}
        <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
          <span>Last updated:</span>
          <span className="font-medium text-gray-700">
            {formData.updated_date
              ? new Date(formData.updated_date).toLocaleString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "-"}
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

        <h1 className="text-3xl font-extrabold mb-6 text-slate-800">Write a New Article</h1>

        {/* Panel */}
  <div className="rounded-2xl p-8 bg-white/90 shadow-lg border border-gray-200">
          {activeTab === "content" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border border-gray-200 px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full border border-gray-200 px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Summary *</label>
                <textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  className="w-full border border-gray-200 px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  rows={3}
                  required
                />
                <span className="text-xs text-gray-400">Brief summary of the article</span>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Content *</label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(val: string) => setFormData((prev) => ({ ...prev, content: val }))}
                />
              </div>
            </div>
          )}

          {activeTab === "featured_image" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Featured Image (from library)</label>
                <ImagePicker
                  value={formData.featured_image_asset ? Number(formData.featured_image_asset) : null}
                  onChange={(id: number | null) =>
                    setFormData((prev) => ({ ...prev, featured_image_asset: id ? String(id) : "" }))
                  }
                  showUpload={true}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Featured Image (upload)</label>
                <input type="file" name="featured_image" onChange={handleChange} className="w-full" />
              </div>
            </div>
          )}

          {activeTab === "classification" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border border-gray-200 px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                >
                  {CATEGORY_CHOICES.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="is_breaking_news"
                    checked={formData.is_breaking_news}
                    onChange={handleChange}
                  />
                  Breaking News
                </label>
              </div>
            </div>
          )}

          {activeTab === "authors" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Author</label>
                <select
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="w-full border border-gray-200 px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                >
                  {authorOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Co-Author</label>
                <select
                  name="co_author"
                  value={formData.co_author}
                  onChange={handleChange}
                  className="w-full border border-gray-200 px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                >
                  {coAuthorOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {activeTab === "publishing" && (
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="is_published"
                    checked={formData.is_published}
                    onChange={handleChange}
                  />
                  Published
                  <button
                    type="button"
                    className="ml-2 px-3 py-1 rounded bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition"
                    onClick={() => {
                      const now = new Date();
                      const pad = (n: number) => n.toString().padStart(2, "0");
                      const local = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
                      setFormData((prev) => ({ ...prev, is_published: true, published_date: local }));
                    }}
                  >
                    Now
                  </button>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Published Date</label>
                <input
                  type="datetime-local"
                  name="published_date"
                  value={formData.published_date}
                  onChange={handleChange}
                  className="w-full border border-gray-200 px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Scheduled Publish Time</label>
                <input
                  type="datetime-local"
                  name="scheduled_publish_time"
                  value={formData.scheduled_publish_time}
                  onChange={handleChange}
                  className="w-full border border-gray-200 px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
              </div>
            </div>
          )}

          {activeTab === "seo" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tags</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full border border-gray-200 px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Meta Description</label>
                <input
                  type="text"
                  name="meta_description"
                  value={formData.meta_description}
                  onChange={handleChange}
                  className="w-full border border-gray-200 px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
              </div>
            </div>
          )}

          {activeTab === "statistics" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">View Count</label>
                <input
                  type="number"
                  value={formData.view_count}
                  readOnly
                  className="w-full border border-gray-200 px-4 py-3 rounded-lg bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Created Date</label>
                <input
                  type="text"
                  value={formData.created_date}
                  readOnly
                  className="w-full border border-gray-200 px-4 py-3 rounded-lg bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Updated Date</label>
                <input
                  type="text"
                  value={formData.updated_date}
                  readOnly
                  className="w-full border border-gray-200 px-4 py-3 rounded-lg bg-gray-100"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <SaveActions
        loading={loading}
        onSave={handleSave}
        onSaveAndAddAnother={handleSaveAndAddAnother}
        onSaveAndContinue={handleSaveAndContinue}
      />
    </div>
  );
}
