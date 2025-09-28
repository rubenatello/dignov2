import React from "react";
import {
  DocumentTextIcon,
  PhotoIcon,
  TagIcon,
  UserIcon,
  ClockIcon,
  ChartBarIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";

type TabKey = "content" | "featured_image" | "classification" | "authors" | "publishing" | "seo" | "statistics";
interface SidebarProps {
  activeTab: TabKey;
  setActiveTab: React.Dispatch<React.SetStateAction<TabKey>>;
}

const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "content", label: "Content", icon: <DocumentTextIcon className="w-5 h-5" /> },
  { key: "featured_image", label: "Featured Image", icon: <PhotoIcon className="w-5 h-5" /> },
  { key: "classification", label: "Classification", icon: <TagIcon className="w-5 h-5" /> },
  { key: "authors", label: "Authors", icon: <UserIcon className="w-5 h-5" /> },
  { key: "publishing", label: "Publishing", icon: <ClockIcon className="w-5 h-5" /> },
  { key: "seo", label: "SEO & Categorization", icon: <AdjustmentsHorizontalIcon className="w-5 h-5" /> },
  { key: "statistics", label: "Statistics", icon: <ChartBarIcon className="w-5 h-5" /> },
];

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => (
  <aside className="h-fit w-64 bg-white rounded-2xl shadow-xl border border-gray-200 p-4 flex flex-col gap-1 sticky top-8">
    <div className="text-center text-lg font-bold text-blue-900 mb-4 tracking-tight">Article Editor</div>
    {tabs.map((tab) => (
      <button
        key={tab.key}
        onClick={() => setActiveTab(tab.key)}
        className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-base transition-all
          ${activeTab === tab.key
            ? "bg-blue-900 text-white shadow border border-blue-900"
            : "hover:bg-blue-50 text-gray-800 border border-transparent"}
        `}
        style={{ outline: "none" }}
      >
        <span className={`w-6 h-6 flex items-center justify-center ${activeTab === tab.key ? "text-white" : "text-blue-900"}`}>{tab.icon}</span>
        <span>{tab.label}</span>
      </button>
    ))}
  </aside>
);

export default Sidebar;
