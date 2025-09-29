import React from "react";
import type { FormDataState } from "./types";
import TagInput from "./TagInput";

interface SeoTabProps {
  formData: FormDataState;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // Optionally, you could pass setFormData if needed
  setFormData?: React.Dispatch<React.SetStateAction<FormDataState>>;
}


const SeoTab: React.FC<SeoTabProps> = ({ formData, handleChange, setFormData }) => {
  // Store tags as an array in formData.tagsArr, but keep formData.tags as comma-separated for backend
  const tagsArr = Array.isArray(formData.tags)
    ? formData.tags
    : (formData.tags ? formData.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : []);

  const setTags = (tags: string[]) => {
    if (setFormData) {
      setFormData((prev) => ({ ...prev, tags: tags.join(", ") }));
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Tags</label>
        <TagInput tags={tagsArr} setTags={setTags} placeholder="Add a tag..." />
        <div className="text-xs text-gray-400 mt-1">Press Enter or comma to add a tag. Click × to remove.</div>
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
  );
};

export default SeoTab;
