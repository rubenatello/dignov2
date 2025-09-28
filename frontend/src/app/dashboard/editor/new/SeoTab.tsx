import React from "react";
import type { FormDataState } from "./types";

interface SeoTabProps {
  formData: FormDataState;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SeoTab: React.FC<SeoTabProps> = ({ formData, handleChange }) => (
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
);

export default SeoTab;
