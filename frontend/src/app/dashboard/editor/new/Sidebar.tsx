

import React, { useState } from "react";
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
  loading: boolean;
  onSave: () => void;
  onSaveAndAddAnother: () => void;
  onSaveAndContinue: () => void;
  slug?: string;
  onPreview: () => void;
  previewDisabled: boolean;
  canDelete?: boolean;
  onDelete?: () => Promise<void> | void;
  onOpenDeleteConfirm?: () => void;
}
import SaveActions from "../SaveActions";
import { useAuth } from "@/contexts/AuthContext";

const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "content", label: "Content", icon: <DocumentTextIcon className="w-5 h-5" /> },
  { key: "featured_image", label: "Featured Image", icon: <PhotoIcon className="w-5 h-5" /> },
  { key: "classification", label: "Classification", icon: <TagIcon className="w-5 h-5" /> },
  { key: "authors", label: "Authors", icon: <UserIcon className="w-5 h-5" /> },
  { key: "publishing", label: "Publishing", icon: <ClockIcon className="w-5 h-5" /> },
  { key: "seo", label: "SEO & Categorization", icon: <AdjustmentsHorizontalIcon className="w-5 h-5" /> },
  { key: "statistics", label: "Statistics", icon: <ChartBarIcon className="w-5 h-5" /> },
];


const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, loading, onSave, onSaveAndAddAnother, onSaveAndContinue, slug, onPreview, previewDisabled, canDelete, onDelete, onOpenDeleteConfirm }) => {
  const { user } = useAuth();
  const allowDelete = Boolean(canDelete) && Boolean(user && (user.is_superuser || user.is_staff || user.role === 'editor'));

  return (
  <aside
    className="min-h-[calc(100vh-48px)] w-56 bg-white/80 backdrop-blur-md border-r border-gray-200 shadow-lg flex flex-col py-8 px-2 gap-2 sticky top-0 z-20"
    style={{ boxShadow: '0 4px 32px 0 rgba(30, 64, 175, 0.06)' }}
  >
    <div className="text-center text-base font-semibold text-blue-900 mb-8 tracking-tight select-none opacity-80">Article Editor</div>
    <nav className="flex flex-col gap-1">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-normal transition-all group
            ${activeTab === tab.key
              ? "bg-blue-50 text-blue-900 font-semibold"
              : "hover:bg-blue-100 text-gray-700"}
          `}
          style={{ outline: "none" }}
        >
          {/* Accent bar for active tab */}
          <span
            className={`absolute left-0 top-1/2 -translate-y-1/2 h-7 w-1.5 rounded-full transition-all ${activeTab === tab.key ? "bg-blue-700" : "bg-transparent"}`}
            aria-hidden="true"
          />
          <span className={`w-5 h-5 flex items-center justify-center ${activeTab === tab.key ? "text-blue-700" : "text-blue-400 group-hover:text-blue-700"}`}>{tab.icon}</span>
          <span className="truncate opacity-90">{tab.label}</span>
        </button>
      ))}
    </nav>
      <div className="mt-8 flex flex-col gap-3">
        <SaveActions
          loading={loading}
          onSave={onSave}
          onSaveAndAddAnother={onSaveAndAddAnother}
          onSaveAndContinue={onSaveAndContinue}
        />
        <button
          type="button"
          className="bg-white border border-primary text-primary text-sm font-semibold px-4 py-2 rounded-md hover:bg-primary hover:text-white transition disabled:opacity-50 mt-2"
          style={{ boxShadow: '0 2px 8px 0 rgba(81, 111, 255, 0.07)' }}
          onClick={onPreview}
          disabled={loading || previewDisabled}
          title={previewDisabled ? 'Fill all required fields to preview' : 'Preview Article'}
        >
          Preview Article
        </button>
        {allowDelete && (
          <>
            <button
              type="button"
              className="bg-red-50 border border-red-300 text-red-700 text-sm font-semibold px-4 py-2 rounded-md hover:bg-red-600 hover:text-white transition disabled:opacity-50 mt-2"
              onClick={() => onOpenDeleteConfirm?.()}
              disabled={loading}
              title="Delete this article"
            >
              Delete Article
            </button>
          </>
        )}
      </div>
  </aside>
  );
};

export default Sidebar;
