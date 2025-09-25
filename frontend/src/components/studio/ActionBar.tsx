import React from "react";

interface ActionBarProps {
  onPreview: () => void;
  onPublish: () => void;
  onSchedule: () => void;
  onSaveDraft: () => void;
  isSaving?: boolean;
  className?: string;
}

export default function ActionBar({
  onPreview,
  onPublish,
  onSchedule,
  onSaveDraft,
  isSaving = false,
  className = "",
}: ActionBarProps) {
  const ActionButton = ({
    onClick,
    variant = "secondary",
    children,
    disabled = false,
  }: {
    onClick: () => void;
    variant?: "primary" | "secondary" | "outline" | "danger";
    children: React.ReactNode;
    disabled?: boolean;
  }) => {
    const baseClasses = "inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    const variantClasses: Record<string, string> = {
      primary: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 focus-visible:ring-blue-500 shadow-sm",
      secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 focus-visible:ring-slate-400",
      outline: "border border-slate-300 text-slate-700 hover:bg-slate-50 focus-visible:ring-blue-500",
      danger: "bg-rose-600 text-white hover:bg-rose-500 focus-visible:ring-rose-500",
    };
    return (
      <button
        onClick={onClick}
        disabled={disabled || isSaving}
        className={`${baseClasses} ${variantClasses[variant]}`}
      >
        {children}
      </button>
    );
  };

  return (
    <div className={`bg-white/70 backdrop-blur-sm rounded-2xl shadow-md border border-slate-200 p-5 ${className}`}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <ActionButton onClick={onPreview} variant="outline">Preview</ActionButton>
          <ActionButton onClick={onSaveDraft} variant="secondary" disabled={isSaving}>
            {isSaving ? (
              <span className="flex items-center gap-2"><span className="animate-spin w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full"/>Saving...</span>
            ) : 'Save Draft'}
          </ActionButton>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ActionButton onClick={onSchedule} variant="outline">Schedule</ActionButton>
          <ActionButton onClick={onPublish} variant="primary" disabled={isSaving}>
            {isSaving ? 'Publishing...' : 'Publish Now'}
          </ActionButton>
        </div>
      </div>
      {isSaving && (
        <div className="mt-3 pt-3 border-t border-slate-200">
          <div className="flex items-center justify-center text-xs text-slate-600 gap-2">
            <span className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />
            <span>Saving your work...</span>
          </div>
        </div>
      )}
    </div>
  );
}
