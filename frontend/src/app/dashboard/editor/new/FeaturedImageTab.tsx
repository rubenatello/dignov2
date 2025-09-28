import React from "react";
import ImagePicker from "../ImagePicker";
import type { FormDataState } from "./types";

interface FeaturedImageTabProps {
  formData: FormDataState;
  setFormData: React.Dispatch<React.SetStateAction<FormDataState>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FeaturedImageTab: React.FC<FeaturedImageTabProps> = ({ formData, setFormData, handleChange }) => (
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
      <label className="inline-block px-4 py-2 bg-primary text-white rounded-lg cursor-pointer hover:bg-primary-dark transition border border-primary">
        Choose File
        <input type="file" name="featured_image" onChange={handleChange} className="hidden" />
      </label>
    </div>
  </div>
);

export default FeaturedImageTab;
