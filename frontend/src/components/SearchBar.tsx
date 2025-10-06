'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  onClose?: () => void;
}

export default function SearchBar({ onClose }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsOpen(false);
      if (onClose) onClose();
    }
  };

  const toggleSearch = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      {/* Search Icon Button */}
      <button 
        onClick={toggleSearch}
        className="text-sm text-gray-700 hover:text-black font-medium p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Search"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" />
        </svg>
      </button>

      {/* Search Dropdown - mobile responsive */}
      {isOpen && (
        <div className="fixed left-0 right-0 top-[60px] mx-auto w-full flex justify-center z-50">
          <div className="w-[95vw] max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg">
            <form onSubmit={handleSearch} className="p-2">
              <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                  autoFocus
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-3 py-2 bg-primary text-white rounded-md hover:brightness-75 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Overlay to close search when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}