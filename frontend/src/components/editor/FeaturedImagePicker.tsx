"use client";
import { useState } from "react";
import type { ImageAsset } from "@/types/image";
import MediaLibraryModal from "./MediaLibraryModal";

export default function FeaturedImagePicker({ value, onChange }: { value?: ImageAsset; onChange: (img: ImageAsset) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-4">
      <label className="block font-semibold mb-1">Featured Image</label>
      {value ? (
        <div className="flex items-center gap-2">
          <img src={value.image_url} alt={value.alt_text} className="w-24 h-16 object-cover rounded" />
          <button className="btn" onClick={() => setOpen(true)}>Change</button>
        </div>
      ) : (
        <button className="btn" onClick={() => setOpen(true)}>Select Image</button>
      )}
      <MediaLibraryModal open={open} onClose={() => setOpen(false)} onSelect={onChange} />
    </div>
  );
}
