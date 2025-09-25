import React from "react";

interface StudioHeaderProps {
  onUndo: () => void;
  onRedo: () => void;
  autosaveTime: string | null;
  versions: string[];
  onVersionSelect: (version: string) => void;
  saveStatus?: 'saved' | 'saving' | 'error' | null;
}

export default function StudioHeader({
  onUndo,
  onRedo,
  autosaveTime,
  versions,
  onVersionSelect,
  saveStatus = null,
}: StudioHeaderProps) {
  const SaveStatusIndicator = () => {
    const statusConfig = {
      saved: { icon: '✓', text: 'Saved', class: 'text-green-600 bg-green-50' },
      saving: { icon: '⏳', text: 'Saving...', class: 'text-blue-600 bg-blue-50' },
      error: { icon: '⚠️', text: 'Save Error', class: 'text-red-600 bg-red-50' },
    };

    if (!saveStatus || !statusConfig[saveStatus]) return null;

    const config = statusConfig[saveStatus];
    
    return (
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.class}`}>
        <span className="mr-1">{config.icon}</span>
        {config.text}
        {autosaveTime && saveStatus === 'saved' && (
          <span className="ml-2 text-xs opacity-75">at {autosaveTime}</span>
        )}
      </div>
    );
  };

  const HeaderButton = ({ 
    onClick, 
    icon, 
    label, 
    disabled = false 
  }: {
    onClick: () => void;
    icon: string;
    label: string;
    disabled?: boolean;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      className={`
        p-2 rounded-lg transition-all duration-200 font-medium
        ${disabled 
          ? 'text-gray-300 cursor-not-allowed' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-md'
        }
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
      `}
    >
      <span className="text-lg">{icon}</span>
    </button>
  );

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side - Title and Status */}
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold text-gray-600 tracking-tight">
            Digno Studio
          </h1>
          <SaveStatusIndicator />
        </div>

        {/* Center - Quick Actions */}
        <div className="flex items-center space-x-2">
          <HeaderButton
            onClick={onUndo}
            icon="↶"
            label="Undo"
          />
          <HeaderButton
            onClick={onRedo}
            icon="↷"
            label="Redo"
          />
        </div>

        {/* Right side - User Actions & Versions */}
        <div className="flex items-center space-x-4">
          {versions.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Versions:</span>
              <select
                onChange={(e) => onVersionSelect(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Latest</option>
                {versions.map((version, index) => (
                  <option key={version} value={version}>
                    Version {index + 1}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {/* User dropdown placeholder */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              W
            </div>
            <span className="text-sm font-medium text-gray-700">Writer</span>
          </div>
        </div>
      </div>
    </header>
  );
}
