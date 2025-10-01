import React from "react";

type TabId = "content" | "featured_image" | "classification" | "authors" | "publishing" | "seo" | "statistics";

interface SidebarTabsProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
}

const tabs: { id: TabId; label: string }[] = [
  { id: "content", label: "Content" },
  { id: "featured_image", label: "Featured Image" },
  { id: "classification", label: "Classification" },
  
  { id: "authors", label: "Authors" },
  { id: "publishing", label: "Publishing" },
  { id: "seo", label: "SEO & Categorization" },
  { id: "statistics", label: "Statistics" },
];

export default function SidebarTabs({ activeTab, setActiveTab }: SidebarTabsProps) {
  return (
    <nav className="flex flex-col gap-2 w-56 pr-4 p-4 rounded-2xl shadow-lg bg-white/90 border border-gray-100">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`relative text-left px-4 py-2 rounded-xl font-medium border transition-all duration-150 overflow-hidden
            ${activeTab === tab.id
              ? "bg-primary/10 text-primary border-primary shadow font-bold"
              : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"}`}
          style={activeTab === tab.id ? { boxShadow: '0 2px 12px 0 rgba(80,120,255,0.08)' } : {}}
          onClick={() => setActiveTab(tab.id)}
        >
          {activeTab === tab.id && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-primary rounded-full" aria-hidden="true"></span>
          )}
          <span className="pl-2">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
