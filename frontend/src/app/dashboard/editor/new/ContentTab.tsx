import React, { useEffect, useRef, useState } from "react";
import RichTextEditor from "../RichTextEditor";
import type { FormDataState } from "./types";
import { generateSlugFromTitle } from "./utils";

interface ContentTabProps {
  formData: FormDataState;
  setFormData: React.Dispatch<React.SetStateAction<FormDataState>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}


const ContentTab: React.FC<ContentTabProps> = ({ formData, setFormData, handleChange }) => {
  // Track if user has manually edited the slug
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const prevTitle = useRef(formData.title);

  // Auto-generate slug from title unless user has manually edited slug
  useEffect(() => {
    if (!slugManuallyEdited && formData.title) {
      const date = formData.created_date ? new Date(formData.created_date) : new Date();
      const autoSlug = generateSlugFromTitle(formData.title, date);
      setFormData((prev) => ({ ...prev, slug: autoSlug }));
    }
    prevTitle.current = formData.title;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.title]);

  // Handler for slug input
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugManuallyEdited(true);
    setFormData((prev) => ({ ...prev, slug: e.target.value }));
  };

  return (
    <div className="space-y-12">
      <div className="space-y-7">
        {/* Title */}
        <div>
          <label className="block text-xl font-bold mb-2 text-gray-800 tracking-tight">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border border-gray-300 px-5 py-3 rounded-xl bg-white/90 focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition text-xl placeholder-gray-400 shadow-sm"
            placeholder="Enter a compelling headline..."
            required
          />
        </div>
        {/* Subtitle */}
        <div>
          <label className="block text-base font-semibold mb-1 text-gray-700">Subtitle</label>
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            className="w-full border border-gray-200 px-4 py-2 rounded-lg bg-white/80 focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition placeholder-gray-400"
            placeholder="Optional: Add a subtitle (appears below the title)"
          />
        </div>
        {/* Slug */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Slug <span className="font-normal text-xs text-gray-500">(URL, auto-generated or custom)</span></label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleSlugChange}
            className="w-full border border-gray-200 px-4 py-2 rounded-lg bg-white/80 focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition placeholder-gray-400"
            placeholder="auto-generated or custom-url"
          />
        </div>
        {/* Summary */}
        <div>
          <div className="flex items-baseline justify-between mb-1">
            <label className="block text-base font-semibold text-gray-700">Summary *</label>
            <span
              className={
                "text-xs font-medium " +
                ((formData.summary?.length || 0) > 300 ? "text-red-600" : "text-gray-500")
              }
              aria-live="polite"
            >
              {(formData.summary?.length || 0)}/300
            </span>
          </div>
          <textarea
            id="summary-input"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            className={
              "w-full px-4 py-3 rounded-lg bg-white/80 focus:ring-2 transition placeholder-gray-400 " +
              ((formData.summary?.length || 0) > 300
                ? "border border-red-300 focus:ring-red-200 focus:border-red-400"
                : "border border-gray-200 focus:ring-primary/20 focus:border-primary/40")
            }
            rows={3}
            required
            aria-invalid={(formData.summary?.length || 0) > 300}
            placeholder="Brief summary of the article..."
          />
          <div className="mt-1">
            {(formData.summary?.length || 0) > 300 ? (
              <span className="text-xs text-red-600">Summaries must be 300 characters or fewer.</span>
            ) : (
              <span className="text-xs text-gray-400">This appears in article previews and search results.</span>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-dashed border-gray-200/70 my-8" />
      <div>
        <label className="block text-lg font-bold mb-2 text-gray-800">Content *</label>
        <div className="rounded-2xl bg-white/90 border border-gray-100/80 shadow-sm p-2 md:p-4">
          <RichTextEditor
            value={formData.content}
            onChange={(val: string) => setFormData((prev) => ({ ...prev, content: val }))}
          />
        </div>
      </div>
    </div>
  );
};

export default ContentTab;
