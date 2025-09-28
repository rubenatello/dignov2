import React from "react";
import type { FormDataState } from "./types";
import { CATEGORY_CHOICES } from "../functions/options";

interface ClassificationTabProps {
  formData: FormDataState;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const ClassificationTab: React.FC<ClassificationTabProps> = ({ formData, handleChange }) => (
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
);

export default ClassificationTab;
