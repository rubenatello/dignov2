"use client";
import { useState } from "react";

export default function SeoPanel({ summary, metaDescription, tags, onChange }: {
  summary: string;
  metaDescription: string;
  tags: string;
  onChange: (fields: { summary?: string; metaDescription?: string; tags?: string }) => void;
}) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 border">
      <div className="mb-4">
        <label className="block font-semibold mb-1">Summary <span className="text-xs text-gray-400">(max 300 chars)</span></label>
        <textarea
          className="input w-full"
          maxLength={300}
          value={summary}
          onChange={e => onChange({ summary: e.target.value })}
        />
        <div className="text-xs text-gray-400 text-right">{summary.length}/300</div>
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Meta Description <span className="text-xs text-gray-400">(max 160 chars)</span></label>
        <textarea
          className="input w-full"
          maxLength={160}
          value={metaDescription}
          onChange={e => onChange({ metaDescription: e.target.value })}
        />
        <div className="text-xs text-gray-400 text-right">{metaDescription.length}/160</div>
      </div>
      <div>
        <label className="block font-semibold mb-1">Tags <span className="text-xs text-gray-400">(comma separated)</span></label>
        <input
          className="input w-full"
          value={tags}
          onChange={e => onChange({ tags: e.target.value })}
        />
      </div>
    </div>
  );
}
