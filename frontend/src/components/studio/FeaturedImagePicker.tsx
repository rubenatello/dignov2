"use client";
import React, { useState } from 'react';
import ImageLibraryModal from './ImageLibraryModal';
import { Image } from '../../lib/api';

interface FeaturedImagePickerProps {
  featuredImageAssetId: number | null;
  setFeaturedImageAssetId: (id: number | null) => void;
  featuredImageFile: File | null;
  setFeaturedImageFile: (file: File | null) => void;
  previewUrl: string | null;
  setPreviewUrl: (url: string | null) => void;
}

export default function FeaturedImagePicker({
  featuredImageAssetId,
  setFeaturedImageAssetId,
  featuredImageFile,
  setFeaturedImageFile,
  previewUrl,
  setPreviewUrl,
}: FeaturedImagePickerProps) {
  const [showLibrary, setShowLibrary] = useState(false);
  const [mode, setMode] = useState<'library' | 'upload'>(featuredImageAssetId ? 'library' : 'upload');

  const handleSelectFromLibrary = (img: Image) => {
    setFeaturedImageAssetId(img.id);
    setFeaturedImageFile(null);
    setPreviewUrl((img as any).image_url || img.image);
    setShowLibrary(false);
  };

  const handleFileChange = (files: FileList | null) => {
    if (!files || !files[0]) return;
    const file = files[0];
    if (!file.type.startsWith('image/')) return;
    setFeaturedImageFile(file);
    setFeaturedImageAssetId(null);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const clearSelection = () => {
    setFeaturedImageAssetId(null);
    setFeaturedImageFile(null);
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
  };

  return (
    <div className="mt-8 p-6 border border-slate-200 rounded-xl bg-white/60">
      <div className="flex items-center justify-between mb-4">
        <label className="block text-lg font-semibold text-slate-900">Featured Image</label>
        {previewUrl && (
          <button
            type="button"
            onClick={clearSelection}
            className="text-xs px-2 py-1 rounded-md bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
          >Remove</button>
        )}
      </div>
      <div className="flex gap-3 mb-4">
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`text-xs px-3 py-1.5 rounded-md border transition-colors ${mode==='upload' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}`}
        >Upload</button>
        <button
          type="button"
          onClick={() => setMode('library')}
          className={`text-xs px-3 py-1.5 rounded-md border transition-colors ${mode==='library' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}`}
        >Library</button>
      </div>
      {previewUrl ? (
        <div className="relative group rounded-lg overflow-hidden border border-slate-200">
          <img src={previewUrl} alt="Featured preview" className="w-full max-h-80 object-cover" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <div className="flex gap-2">
              {mode === 'upload' && (
                <label className="text-xs px-3 py-1.5 rounded bg-white/90 text-slate-700 cursor-pointer hover:bg-white" htmlFor="featured-upload">Replace</label>
              )}
              {mode === 'library' && (
                <button type="button" onClick={() => setShowLibrary(true)} className="text-xs px-3 py-1.5 rounded bg-white/90 text-slate-700 hover:bg-white">Change</button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 flex flex-col items-center justify-center text-center">
          {mode === 'upload' ? (
            <>
              <p className="text-sm text-slate-600 mb-4">Drag & drop or click to upload a featured image</p>
              <input id="featured-upload" type="file" accept="image/*" className="hidden" onChange={e => handleFileChange(e.target.files)} />
              <label htmlFor="featured-upload" className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors">Select Image</label>
            </>
          ) : (
            <>
              <p className="text-sm text-slate-600 mb-4">Choose an image from the media library</p>
              <button type="button" onClick={() => setShowLibrary(true)} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors">Open Library</button>
            </>
          )}
        </div>
      )}
      {showLibrary && (
        <ImageLibraryModal
          isOpen={showLibrary}
          onClose={() => setShowLibrary(false)}
          onSelectImage={handleSelectFromLibrary}
        />
      )}
    </div>
  );
}
