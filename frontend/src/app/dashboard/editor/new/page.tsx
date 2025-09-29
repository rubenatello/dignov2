"use client";
import StatisticsTab from "./StatisticsTab";
import SeoTab from "./SeoTab";
import PublishingTab from "./PublishingTab";
import ClassificationTab from "./ClassificationTab";
import AuthorsTab from "./AuthorsTab";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
// @ts-ignore
import axios from "axios";
import { useInterval } from "react-use";
import StudioHeader from "../StudioHeader";
import ContentTab from "./ContentTab";
import FeaturedImageTab from "./FeaturedImageTab";
import SaveActions from "../SaveActions";
import Sidebar from "./Sidebar";
import { CATEGORY_CHOICES, authorOptions, coAuthorOptions } from "../functions/options";
import { handleFormChange } from "../functions/formHandlers";
import { useArticleSave } from "../functions/useArticleSave";
import type { FormDataState } from "./types";
import { getNext6amET } from "./utils";

export default function ArticleWriter() {
  const router = useRouter();

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



  // Change handler (modularized)
  const handleChange = handleFormChange<FormDataState>(setFormData);

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


  // Modular save actions
  const { handleSave, handleSaveAndAddAnother, handleSaveAndContinue } = useArticleSave(
    formData,
    setFormData,
    setLoading,
    router
  );

  // Basic router guard (optional)
  useEffect(() => {
    if (!router) {
      console.error("NextRouter is not mounted.");
    }
  }, [router]);

  return (
    <>
      <StudioHeader user={{ name: "Admin" }} onBack={() => setShowBackModal(true)} />
  <div className="min-h-screen p-8 flex flex-row gap-12 pt-[88px] md:pt-[104px]" style={{ background: '#eef8feff' }}>
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          loading={loading}
          onSave={handleSave}
          onSaveAndAddAnother={handleSaveAndAddAnother}
          onSaveAndContinue={handleSaveAndContinue}
        />
        <main className="flex-1 max-w-3xl mx-auto">
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

          <h2 className="text-lg font-bold mb-8 text-slate-800">Write a New Article</h2>

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
