import React from "react";

interface HeadlineSectionProps {
  title: string;
  setTitle: (v: string) => void;
  summary: string;
  setSummary: (v: string) => void;
}

export default function HeadlineSection({ title, setTitle, summary, setSummary }: HeadlineSectionProps) {
  return (
    <section className="mb-10">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-1 tracking-wide text-gray-700">Headline</label>
          <input 
            type="text" 
            className="w-full rounded-xl border border-gray-200 bg-white/70 backdrop-blur-sm px-4 py-3 text-lg font-semibold tracking-tight placeholder:font-normal placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition shadow-sm" 
            placeholder="What's the story?" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 tracking-wide text-gray-700">Summary</label>
          <textarea 
            className="w-full rounded-xl border border-gray-200 bg-white/60 backdrop-blur-sm px-4 py-3 text-sm leading-relaxed placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition shadow-sm" 
            placeholder="Brief summary" 
            rows={3} 
            value={summary} 
            onChange={e => setSummary(e.target.value)} 
          />
        </div>
      </div>
    </section>
  );
}
