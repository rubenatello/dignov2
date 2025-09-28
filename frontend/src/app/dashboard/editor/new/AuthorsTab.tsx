import React from "react";
import type { FormDataState } from "./types";
import { authorOptions, coAuthorOptions } from "../functions/options";

interface AuthorsTabProps {
  formData: FormDataState;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const AuthorsTab: React.FC<AuthorsTabProps> = ({ formData, handleChange }) => (
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
);

export default AuthorsTab;
