'use client';

import React from 'react';

interface TitleSectionProps {
  title: string;
  slug: string;
  editingSlug: boolean;
  slugInput: string;
  onTitleChange: (title: string) => void;
  onEditSlug: () => void;
  onSaveSlug: () => void;
  onCancelSlug: () => void;
  onSlugInputChange: (value: string) => void;
}

export default function TitleSection({
  title,
  slug,
  editingSlug,
  slugInput,
  onTitleChange,
  onEditSlug,
  onSaveSlug,
  onCancelSlug,
  onSlugInputChange
}: TitleSectionProps) {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Article title..."
          className="w-full text-5xl font-bold text-slate-800 bg-transparent border-none focus:outline-none placeholder-slate-400 font-serif leading-tight"
          style={{ fontFamily: 'Georgia, serif' }}
        />
      </div>

      {/* Slug preview & edit */}
      <div className="flex items-center gap-2 text-sm text-slate-500 select-none">
        <span className="font-semibold text-slate-400">URL:</span>
        {!editingSlug ? (
          <>
            <span className="bg-slate-100 px-2 py-0.5 rounded text-blue-700 font-mono tracking-tight border border-slate-200">
              {slug || 'auto-generated-from-title'}
            </span>
            <button
              onClick={onEditSlug}
              className="text-blue-600 hover:text-blue-700 underline focus:outline-none transition-colors duration-150"
            >
              edit
            </button>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={slugInput}
              onChange={(e) => onSlugInputChange(e.target.value)}
              className="bg-white border border-slate-300 rounded px-2 py-1 font-mono text-blue-700 tracking-tight focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="custom-url-slug"
            />
            <div className="flex gap-1">
              <button
                onClick={onSaveSlug}
                className="text-green-600 hover:text-green-700 font-semibold focus:outline-none transition-colors duration-150"
              >
                ✓
              </button>
              <button
                onClick={onCancelSlug}
                className="text-red-600 hover:text-red-700 font-semibold focus:outline-none transition-colors duration-150"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}