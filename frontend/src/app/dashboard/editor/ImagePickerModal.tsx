import { useState } from "react";
import ImagePicker, { ImageAsset } from "./ImagePicker";

interface ImagePickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (img: ImageAsset) => void;
}

export default function ImagePickerModal({ open, onClose, onSelect }: ImagePickerModalProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<ImageAsset | undefined>(undefined);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full relative">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-black" onClick={onClose}>&times;</button>
        <h2 className="text-lg font-bold mb-4">Select Image</h2>
        <ImagePicker
          value={selectedId}
          onChange={(id, img) => {
            setSelectedId(id);
            setSelectedImage(img);
          }}
        />
        <div className="flex justify-end mt-4 gap-2">
          <button className="px-4 py-2 rounded bg-gray-200" onClick={onClose}>Cancel</button>
          <button
            className="px-4 py-2 rounded bg-primary text-white disabled:opacity-50"
            disabled={!selectedImage}
            onClick={() => {
              if (selectedImage) onSelect(selectedImage);
              onClose();
            }}
          >
            Insert Image
          </button>
        </div>
      </div>
    </div>
  );
}
