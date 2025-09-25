"use client";

import React, { useEffect, useRef, useCallback, useState } from "react";
import "quill/dist/quill.snow.css";
import ImageLibraryModal from './ImageLibraryModal';
import { Image } from '../../lib/api';

interface QuillEditorProps {
  title: string;
  summary: string;
  content: string;
  onTitleChange: (title: string) => void;
  onSummaryChange: (summary: string) => void;
  onContentChange: (content: string) => void;
}

// Generate a unique ID for this editor instance
const generateUniqueId = () => `quill-editor-${Math.random().toString(36).substr(2, 9)}`;

export default function QuillEditor({
  title,
  summary,
  content,
  onTitleChange,
  onSummaryChange,
  onContentChange,
}: QuillEditorProps) {
  const quillRef = useRef<HTMLDivElement>(null);
  const quillInstance = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [showImageModal, setShowImageModal] = useState(false);
  const editorId = useRef<string>(generateUniqueId());
  const isInitializedRef = useRef<boolean>(false);

  const handleContentChange = useCallback(() => {
    if (quillInstance.current) {
      const htmlContent = quillInstance.current.root.innerHTML;
      onContentChange(htmlContent);
    }
  }, [onContentChange]);

  const handleImageSelect = useCallback((image: Image) => {
    if (quillInstance.current) {
      const range = quillInstance.current.getSelection(true);
      quillInstance.current.insertEmbed(range.index, 'image', image.image_url);
    }
    setShowImageModal(false);
  }, []);

  useEffect(() => {
    // Only initialize once
    if (!quillRef.current || isInitializedRef.current) return;

    const currentRef = quillRef.current;
    
    const initQuill = async () => {
      try {
        const Quill = (await import("quill")).default;

        // Remove any existing toolbars from the parent container
        const parentContainer = currentRef.parentElement;
        if (parentContainer) {
          const existingToolbars = parentContainer.querySelectorAll('.ql-toolbar');
          existingToolbars.forEach(toolbar => {
            if (toolbar.parentNode) {
              toolbar.parentNode.removeChild(toolbar);
            }
          });
        }

        // Clear the ref content completely
        currentRef.innerHTML = '';

        // Custom image handler
        const imageHandler = () => {
          setShowImageModal(true);
        };

        // Register Divider blot
        const BlockEmbed = (await import('quill')).default.import('blots/block/embed');
        class DividerBlot extends BlockEmbed {
          static blotName = 'divider';
          static tagName = 'hr';
        }
        (await import('quill')).default.register(DividerBlot);

        // Custom divider handler
        const dividerHandler = () => {
          const range = quillInstance.current.getSelection(true);
          quillInstance.current.insertEmbed(range.index, 'divider', true, 'user');
        };

        const undoHandler = () => {
          quillInstance.current.history.undo();
        };
        const redoHandler = () => {
          quillInstance.current.history.redo();
        };

        const toolbarOptions = {
          container: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['blockquote', 'code-block'],
            ['link', 'image', 'divider'],
            ['undo', 'redo'],
            ['clean']
          ],
          handlers: {
            image: imageHandler,
            divider: dividerHandler,
            undo: undoHandler,
            redo: redoHandler
          }
        };
        // Add custom SVG icons for divider, undo, and redo
        setTimeout(() => {
          // Divider icon
          const dividerBtn = currentRef.parentElement?.querySelector('.ql-divider');
          if (dividerBtn && dividerBtn instanceof HTMLElement) {
            dividerBtn.innerHTML = `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="3" y1="11" x2="19" y2="11" stroke="#475569" stroke-width="2" stroke-linecap="round"/></svg>`;
          }
          // Standard undo icon (circular arrow left)
          const undoBtn = currentRef.parentElement?.querySelector('.ql-undo');
          if (undoBtn && undoBtn instanceof HTMLElement) {
            undoBtn.innerHTML = `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 4a7 7 0 1 1-7 7" stroke="#475569" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><polyline points="7 7 4 11 7 15" stroke="#475569" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`;
          }
          // Standard redo icon (circular arrow right)
          const redoBtn = currentRef.parentElement?.querySelector('.ql-redo');
          if (redoBtn && redoBtn instanceof HTMLElement) {
            redoBtn.innerHTML = `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 4a7 7 0 1 0 7 7" stroke="#475569" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><polyline points="15 7 18 11 15 15" stroke="#475569" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`;
          }
          // Force hide any duplicate toolbars that might still appear
          const allToolbars = document.querySelectorAll('.ql-toolbar');
          if (allToolbars.length > 1) {
            for (let i = 1; i < allToolbars.length; i++) {
              (allToolbars[i] as HTMLElement).style.display = 'none';
            }
          }
        }, 100);

        quillInstance.current = new Quill(currentRef, {
          theme: 'snow',
          placeholder: 'Tell your story...',
          modules: {
            toolbar: toolbarOptions
          },
          formats: [
            'header', 'bold', 'italic', 'underline',
            'list', 'indent',
            'link', 'blockquote', 'code-block', 'image', 'divider'
          ]
        });

        // Set initial content
        if (content) {
          quillInstance.current.root.innerHTML = content;
        }

        // Handle content changes
        quillInstance.current.on('text-change', handleContentChange);
        
        // Mark as initialized
        isInitializedRef.current = true;

        // Add custom SVG icon for divider button
        setTimeout(() => {
          const dividerBtn = currentRef.parentElement?.querySelector('.ql-divider');
          if (dividerBtn && dividerBtn instanceof HTMLElement) {
            dividerBtn.innerHTML = `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="3" y1="11" x2="19" y2="11" stroke="#475569" stroke-width="2" stroke-linecap="round"/></svg>`;
          }
          // Force hide any duplicate toolbars that might still appear
          const allToolbars = document.querySelectorAll('.ql-toolbar');
          if (allToolbars.length > 1) {
            for (let i = 1; i < allToolbars.length; i++) {
              (allToolbars[i] as HTMLElement).style.display = 'none';
            }
          }
        }, 100);

      } catch (error) {
        console.error('Failed to initialize Quill:', error);
        isInitializedRef.current = false;
      }
    };

    initQuill();

    return () => {
      if (quillInstance.current) {
        quillInstance.current.off('text-change', handleContentChange);
        quillInstance.current = null;
        isInitializedRef.current = false;
      }
    };
  }, []); // Empty dependency array - only run once

  // Separate effect for content updates
  useEffect(() => {
    if (isInitializedRef.current && quillInstance.current && content !== quillInstance.current.root.innerHTML) {
      // Temporarily disable the text-change listener to prevent infinite loop
      quillInstance.current.off('text-change', handleContentChange);
      quillInstance.current.root.innerHTML = content || '';
      quillInstance.current.on('text-change', handleContentChange);
    }
  }, [content, handleContentChange]);

  return (
    <div className="w-full max-w-5xl mx-auto font-georgia">
      {/* Title Input */}
      <div className="mb-6">
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Craft your headline..."
          className="w-full text-5xl font-bold text-slate-800 placeholder-slate-400 border-none outline-none bg-transparent resize-none leading-tight transition-colors duration-200 focus:text-slate-900"
          style={{ fontFamily: 'Georgia, serif' }}
        />
      </div>

      {/* Summary Input */}
      <div className="mb-8">
        <textarea
          value={summary}
          onChange={(e) => onSummaryChange(e.target.value)}
          placeholder="Add a compelling subtitle..."
          className="w-full text-xl text-slate-600 placeholder-slate-400 border-none outline-none bg-transparent resize-none leading-relaxed transition-colors duration-200 focus:text-slate-700"
          style={{ fontFamily: 'Georgia, serif' }}
          rows={2}
        />
      </div>

      {/* Quill Editor */}
      <div className="quill-editor-container relative">
        <div 
          ref={quillRef}
          className="min-h-[500px]"
          style={{ fontFamily: 'Georgia, serif' }}
          key={editorId.current}
          id={editorId.current}
        />
      </div>

      {/* Image Library Modal */}
      <ImageLibraryModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        onSelectImage={handleImageSelect}
      />

      <style jsx global>{`
        /* Divider styling */
        .ql-editor hr {
          border: none;
          border-top: 1.5px solid #cbd5e1;
          margin: 2.5em 0;
        }
        /* Hide duplicate toolbars aggressively */
        .quill-editor-container .ql-toolbar:not(:first-child) {
          display: none !important;
        }
        
        /* Clean minimal toolbar styling - BIGGER & MORE LEGIBLE */
        .ql-toolbar {
          border: none !important;
          background: rgba(255, 255, 255, 0.9) !important;
          padding: 16px 20px !important;
          margin-bottom: 24px !important;
          border-radius: 12px !important;
          backdrop-filter: blur(10px) !important;
          box-shadow: 0 4px 16px rgba(59, 130, 246, 0.1) !important;
          position: relative !important;
          z-index: 1000 !important;
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 24px !important;
        }
        
        /* Toolbar dropdown fix */
        .ql-toolbar .ql-picker {
          position: relative !important;
          z-index: 1001 !important;
        }
        
        .ql-toolbar .ql-picker-options {
          position: absolute !important;
          z-index: 1002 !important;
          background: white !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 8px !important;
          box-shadow: 0 10px 40px rgba(0,0,0,0.15) !important;
          backdrop-filter: blur(20px) !important;
          margin-top: 4px !important;
        }
        
        .ql-toolbar .ql-picker-item {
          padding: 12px 20px !important;
          font-size: 14px !important;
          transition: all 0.15s ease !important;
        }
        
        .ql-toolbar .ql-picker-item:hover {
          background: #f1f5f9 !important;
        }
        
        /* Toolbar button styling - BIGGER */
        .ql-toolbar .ql-formats {
          margin-right: 24px !important;
        }
        
        .ql-toolbar button {
          border-radius: 8px !important;
          padding: 16px 18px !important;
          margin: 0 6px !important;
          transition: all 0.15s ease !important;
          border: 1px solid transparent !important;
          color: #475569 !important;
          min-width: 48px !important;
          min-height: 48px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
        }

        .ql-toolbar button svg {
          width: 32px !important;
          height: 32px !important;
        }
        
        .ql-toolbar button:hover {
          background: #eff6ff !important;
          color: #1e40af !important;
          border-color: #bfdbfe !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15) !important;
        }
        
        .ql-toolbar button.ql-active {
          background: #3b82f6 !important;
          color: white !important;
          border-color: #2563eb !important;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3) !important;
        }
        
        /* Picker labels bigger and more legible */
        .ql-toolbar .ql-picker-label {
          font-size: 14px !important;
          font-weight: 500 !important;
          color: #475569 !important;
          padding: 12px 16px !important;
        }
        
        /* Clean container styling */
        .ql-container {
          border: none !important;
          background: transparent !important;
          font-family: Georgia, serif !important;
          position: relative !important;
          z-index: 1 !important;
        }
        
        /* Editor content styling */
        .ql-editor {
          font-family: Georgia, serif !important;
          font-size: 1.125rem !important;
          line-height: 1.7 !important;
          color: #334155 !important;
          padding: 0 !important;
          border: none !important;
          min-height: 500px !important;
        }
        
        .ql-editor:focus {
          outline: none !important;
        }
        
        .ql-editor h1 {
          font-size: 2.5rem !important;
          font-weight: 700 !important;
          margin: 2em 0 1em 0 !important;
          line-height: 1.2 !important;
          color: #0f172a !important;
        }
        
        .ql-editor h2 {
          font-size: 2rem !important;
          font-weight: 600 !important;
          margin: 1.8em 0 0.8em 0 !important;
          line-height: 1.3 !important;
          color: #1e293b !important;
        }
        
        .ql-editor h3 {
          font-size: 1.5rem !important;
          font-weight: 600 !important;
          margin: 1.5em 0 0.8em 0 !important;
          line-height: 1.4 !important;
          color: #334155 !important;
        }
        
        .ql-editor p {
          margin: 1.5em 0 !important;
          font-size: 1.125rem !important;
          line-height: 1.7 !important;
          color: #475569 !important;
        }
        
        .ql-editor ul, .ql-editor ol {
          margin: 1.2em 0 !important;
          padding-left: 2em !important;
        }
        
        .ql-editor li {
          margin: 0.8em 0 !important;
          line-height: 1.6 !important;
          color: #475569 !important;
        }
        
        .ql-editor strong {
          font-weight: 700 !important;
          color: #1e293b !important;
        }
        
        .ql-editor em {
          font-style: italic !important;
          color: #64748b !important;
        }
        
        .ql-editor blockquote {
          border-left: 3px solid #3b82f6 !important;
          margin: 2em 0 !important;
          padding-left: 1.5em !important;
          font-style: italic !important;
          color: #64748b !important;
        }
        
        .ql-editor .ql-code-block-container {
          background: #1e293b !important;
          color: #f1f5f9 !important;
          border-radius: 8px !important;
          padding: 1.5rem !important;
          margin: 1.5em 0 !important;
          font-family: 'JetBrains Mono', 'Fira Code', monospace !important;
        }
        
        .ql-editor.ql-blank::before {
          font-family: Georgia, serif !important;
          font-style: italic !important;
          color: #94a3b8 !important;
          font-size: 1.125rem !important;
        }
        
        .ql-editor img {
          border-radius: 8px !important;
          margin: 1.5em 0 !important;
          max-width: 100% !important;
        }
        
        .ql-editor a {
          color: #3b82f6 !important;
          text-decoration: underline !important;
          text-underline-offset: 2px !important;
        }
        
        .ql-editor a:hover {
          color: #2563eb !important;
        }
      `}</style>
    </div>
  );
}