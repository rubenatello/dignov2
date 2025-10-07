'use client';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface SlugConflictDialogProps {
  isOpen: boolean;
  currentSlug: string;
  title: string;
  onResolve: (action: 'overwrite' | 'back' | 'next') => void | Promise<void>;
}

export function SlugConflictDialog({ isOpen, currentSlug, title, onResolve }: SlugConflictDialogProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (isOpen) {
      // Basic debug to confirm rendering path
      // eslint-disable-next-line no-console
      console.debug('[SlugConflictDialog] Open', { currentSlug, title });
      // Prevent background scroll
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen, currentSlug, title]);
  if (!isOpen || !mounted) return null;
  const dialog = (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" />
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 z-[1001]">
        <h2 className="text-lg font-semibold mb-2">Slug Conflict Detected</h2>
        <p className="text-sm text-gray-700 mb-4">
          An article with the slug <strong>"{currentSlug}"</strong> already exists.<br />
          Title: <strong>"{title}"</strong>
        </p>
        <div className="flex flex-col gap-2">
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => onResolve('overwrite')}
          >
            Overwrite Existing
          </button>
          <button
            className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
            onClick={() => onResolve('back')}
          >
            Go Back
          </button>
          <button
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
            onClick={() => onResolve('next')}
          >
            Generate Next Available Slug
          </button>
        </div>
      </div>
    </div>
  );
  return createPortal(dialog, document.body);
}
