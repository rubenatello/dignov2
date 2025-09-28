import React from "react";
import RichTextEditor from "../RichTextEditor";
import type { FormDataState } from "./types";

interface ContentTabProps {
  formData: FormDataState;
  setFormData: React.Dispatch<React.SetStateAction<FormDataState>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ContentTab: React.FC<ContentTabProps> = ({ formData, setFormData, handleChange }) => (
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
          onChange={handleChange}
          className="w-full border border-gray-200 px-4 py-2 rounded-lg bg-white/80 focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition placeholder-gray-400"
          placeholder="auto-generated or custom-url"
        />
      </div>
      {/* Summary */}
      <div>
        <label className="block text-base font-semibold mb-1 text-gray-700">Summary *</label>
        <textarea
          name="summary"
          value={formData.summary}
          onChange={handleChange}
          className="w-full border border-gray-200 px-4 py-3 rounded-lg bg-white/80 focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition placeholder-gray-400"
          rows={3}
          required
          placeholder="Brief summary of the article..."
        />
        <span className="text-xs text-gray-400">This appears in article previews and search results.</span>
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

export default ContentTab;
