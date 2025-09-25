'use client';

import React from 'react';

interface MetaFieldsProps {
  metaDescription: string;
  tags: string;
  tagInput: string;
  onMetaDescriptionChange: (value: string) => void;
  onTagInputChange: (value: string) => void;
  onRemoveTag: (tag: string) => void;
  onTagKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function MetaFields({
  metaDescription,
  tags,
  tagInput,
  onMetaDescriptionChange,
  onTagInputChange,
  onRemoveTag,
  onTagKeyDown
}: MetaFieldsProps) {
  const tagArray = tags ? tags.split(',').filter(t => t.trim()) : [];

  return (
    <div className="space-y-6">
      {/* Meta Description */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">
          Meta Description ({160 - metaDescription.length} chars left)
        </label>
        <textarea
          value={metaDescription}
          onChange={(e) => onMetaDescriptionChange(e.target.value.slice(0, 160))}
          rows={2}
          placeholder="Short SEO summary..."
          className="w-full rounded-lg border border-blue-200/60 bg-white/80 backdrop-blur-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200/60 focus:border-blue-300/60 resize-none shadow-sm shadow-blue-100/50"
        />
      </div>

      {/* Tag Chips */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Tags</label>
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-blue-200/60 bg-white/80 backdrop-blur-sm px-3 py-2 shadow-sm shadow-blue-100/50">
          {tagArray.map(tag => (
            <span key={tag} className="group inline-flex items-center gap-1 text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
              {tag.trim()}
              <button
                type="button"
                onClick={() => onRemoveTag(tag)}
                className="text-blue-500 hover:text-rose-600 focus:outline-none"
              >×</button>
            </span>
          ))}
          <input
            type="text"
            value={tagInput}
            onChange={(e) => onTagInputChange(e.target.value)}
            onKeyDown={onTagKeyDown}
            placeholder="Add tag and press Enter"
            className="flex-1 min-w-[120px] bg-transparent text-sm focus:outline-none py-1"
          />
        </div>
      </div>
    </div>
  );
}