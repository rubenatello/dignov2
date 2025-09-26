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
    <nav className="flex flex-col gap-2 w-56 pr-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`text-left px-4 py-2 rounded-lg font-medium border transition-all duration-150 "
            ${activeTab === tab.id ? "bg-primary text-white border-primary shadow" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"}`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
