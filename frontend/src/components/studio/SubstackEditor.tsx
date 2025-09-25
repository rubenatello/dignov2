"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Editor, EditorContent } from "@tiptap/react";

interface SubstackEditorProps {
  editor: Editor | null;
  title: string;
  summary: string;
  onTitleChange: (title: string) => void;
  onSummaryChange: (summary: string) => void;
}

export default function SubstackEditor({
  editor,
  title,
  summary,
  onTitleChange,
  onSummaryChange,
}: SubstackEditorProps) {
  const [showToolbar, setShowToolbar] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);
  
  const updateToolbar = useCallback(() => {
    if (!editor) return;
    
    const { selection } = editor.state;
    const { from, to } = selection;
    
    // Show toolbar if there's a text selection or cursor is active
    if (from !== to || editor.isFocused) {
      setShowToolbar(true);
      
      // Position the toolbar near the selection
      const { view } = editor;
      const start = view.coordsAtPos(from);
      const toolbar = toolbarRef.current;
      
      if (toolbar && start) {
        const editorElement = view.dom.getBoundingClientRect();
        toolbar.style.left = `${Math.min(start.left - editorElement.left, window.innerWidth - 400)}px`;
        toolbar.style.top = `${start.top - editorElement.top - 60}px`;
      }
    } else {
      setShowToolbar(false);
    }
  }, [editor]);

  useEffect(() => {
    if (!editor) return;
    
    const handleUpdate = () => updateToolbar();
    const handleSelectionUpdate = () => updateToolbar();
    const handleFocus = () => updateToolbar();
    const handleBlur = () => {
      // Delay hiding to allow toolbar interaction
      setTimeout(() => {
        if (!editor.isFocused) setShowToolbar(false);
      }, 100);
    };

    editor.on('update', handleUpdate);
    editor.on('selectionUpdate', handleSelectionUpdate);
    editor.on('focus', handleFocus);
    editor.on('blur', handleBlur);

    return () => {
      editor.off('update', handleUpdate);
      editor.off('selectionUpdate', handleSelectionUpdate);
      editor.off('focus', handleFocus);
      editor.off('blur', handleBlur);
    };
  }, [editor, updateToolbar]);

  return (
    <div className="w-full max-w-4xl mx-auto bg-white">
      {/* Always Visible Toolbar at Top */}
      {editor && (
        <div className="flex items-center space-x-1 bg-white border-b border-gray-200 px-4 py-3 mb-6">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`px-3 py-1.5 rounded text-sm font-bold hover:bg-blue-50 transition-colors ${
              editor.isActive('bold') ? 'bg-blue-600 text-white' : 'text-gray-700 bg-gray-100'
            }`}
          >
            B
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`px-3 py-1.5 rounded text-sm italic hover:bg-blue-50 transition-colors ${
              editor.isActive('italic') ? 'bg-blue-600 text-white' : 'text-gray-700 bg-gray-100'
            }`}
          >
            I
          </button>
          <div className="w-px h-6 bg-gray-300 mx-2" />
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`px-3 py-1.5 rounded text-xs font-bold hover:bg-blue-50 transition-colors ${
              editor.isActive('heading', { level: 1 }) ? 'bg-blue-600 text-white' : 'text-gray-700 bg-gray-100'
            }`}
          >
            H1
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-3 py-1.5 rounded text-xs font-bold hover:bg-blue-50 transition-colors ${
              editor.isActive('heading', { level: 2 }) ? 'bg-blue-600 text-white' : 'text-gray-700 bg-gray-100'
            }`}
          >
            H2
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`px-3 py-1.5 rounded text-xs font-bold hover:bg-blue-50 transition-colors ${
              editor.isActive('heading', { level: 3 }) ? 'bg-blue-600 text-white' : 'text-gray-700 bg-gray-100'
            }`}
          >
            H3
          </button>
          <div className="w-px h-6 bg-gray-300 mx-2" />
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`px-3 py-1.5 rounded text-sm hover:bg-blue-50 transition-colors ${
              editor.isActive('bulletList') ? 'bg-blue-600 text-white' : 'text-gray-700 bg-gray-100'
            }`}
          >
            •
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`px-3 py-1.5 rounded text-sm hover:bg-blue-50 transition-colors ${
              editor.isActive('orderedList') ? 'bg-blue-600 text-white' : 'text-gray-700 bg-gray-100'
            }`}
          >
            1.
          </button>
        </div>
      )}
      {/* Title Input - Large, clean */}
      <div className="mb-8">
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Title"
          className="w-full text-4xl font-bold text-gray-900 placeholder-gray-400 border-none outline-none bg-transparent resize-none leading-tight"
          style={{ fontFamily: 'Georgia, serif' }}
        />
      </div>

      {/* Summary Input - Medium, subtitle style */}
      <div className="mb-8">
        <textarea
          value={summary}
          onChange={(e) => onSummaryChange(e.target.value)}
          placeholder="Add a subtitle..."
          className="w-full text-xl text-gray-600 placeholder-gray-400 border-none outline-none bg-transparent resize-none leading-relaxed"
          style={{ fontFamily: 'Georgia, serif' }}
          rows={2}
        />
      </div>

      {/* Content Editor - Tiptap with floating toolbar */}
      <div className="relative">
        {/* Floating Toolbar - appears on text selection */}
        {showToolbar && editor && (
          <div 
            ref={toolbarRef}
            className="absolute z-50 flex items-center space-x-1 bg-gray-900 text-white rounded-lg px-3 py-2 shadow-lg"
            style={{ transform: 'translateY(-100%)' }}
          >
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`px-2 py-1 rounded text-sm font-bold hover:bg-gray-700 transition-colors ${
                editor.isActive('bold') ? 'bg-blue-600 text-white' : 'text-gray-300'
              }`}
              onMouseDown={(e) => e.preventDefault()}
            >
              B
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`px-2 py-1 rounded text-sm italic hover:bg-gray-700 transition-colors ${
                editor.isActive('italic') ? 'bg-blue-600 text-white' : 'text-gray-300'
              }`}
              onMouseDown={(e) => e.preventDefault()}
            >
              I
            </button>
            <div className="w-px h-4 bg-gray-600 mx-1" />
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`px-2 py-1 rounded text-xs font-bold hover:bg-gray-700 transition-colors ${
                editor.isActive('heading', { level: 1 }) ? 'bg-blue-600 text-white' : 'text-gray-300'
              }`}
              onMouseDown={(e) => e.preventDefault()}
            >
              H1
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`px-2 py-1 rounded text-xs font-bold hover:bg-gray-700 transition-colors ${
                editor.isActive('heading', { level: 2 }) ? 'bg-blue-600 text-white' : 'text-gray-300'
              }`}
              onMouseDown={(e) => e.preventDefault()}
            >
              H2
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`px-2 py-1 rounded text-xs font-bold hover:bg-gray-700 transition-colors ${
                editor.isActive('heading', { level: 3 }) ? 'bg-blue-600 text-white' : 'text-gray-300'
              }`}
              onMouseDown={(e) => e.preventDefault()}
            >
              H3
            </button>
            <div className="w-px h-4 bg-gray-600 mx-1" />
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`px-2 py-1 rounded text-sm hover:bg-gray-700 transition-colors ${
                editor.isActive('bulletList') ? 'bg-blue-600 text-white' : 'text-gray-300'
              }`}
              onMouseDown={(e) => e.preventDefault()}
            >
              •
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`px-2 py-1 rounded text-sm hover:bg-gray-700 transition-colors ${
                editor.isActive('orderedList') ? 'bg-blue-600 text-white' : 'text-gray-300'
              }`}
              onMouseDown={(e) => e.preventDefault()}
            >
              1.
            </button>
          </div>
        )}

        {/* Main Content Editor */}
        <div className="prose prose-lg prose-gray max-w-none">
          {editor && (
            <EditorContent
              editor={editor}
              className="min-h-[400px] focus:outline-none substack-editor-content"
              style={{ fontFamily: 'Georgia, serif' }}
            />
          )}
        </div>
      </div>

      <style jsx>{`
        .substack-editor-content .ProseMirror {
          outline: none;
          font-family: Georgia, serif;
          line-height: 1.6;
          font-size: 1.125rem;
          color: #374151;
        }
        
        .substack-editor-content .ProseMirror p {
          margin: 1.2em 0;
          font-size: 1.125rem;
          line-height: 1.6;
        }
        
        .substack-editor-content .ProseMirror h1 {
          font-size: 2rem;
          font-weight: bold;
          margin: 1.5em 0 0.5em 0;
          line-height: 1.2;
          color: #111827;
        }
        
        .substack-editor-content .ProseMirror h2 {
          font-size: 1.5rem;
          font-weight: bold;
          margin: 1.3em 0 0.5em 0;
          line-height: 1.3;
          color: #111827;
        }
        
        .substack-editor-content .ProseMirror h3 {
          font-size: 1.25rem;
          font-weight: bold;
          margin: 1.2em 0 0.5em 0;
          line-height: 1.4;
          color: #111827;
        }
        
        .substack-editor-content .ProseMirror ul {
          margin: 1em 0;
          padding-left: 1.5em;
          list-style-type: disc;
        }
        
        .substack-editor-content .ProseMirror ol {
          margin: 1em 0;
          padding-left: 1.5em;
          list-style-type: decimal;
        }
        
        .substack-editor-content .ProseMirror li {
          margin: 0.5em 0;
          line-height: 1.6;
        }
        
        .substack-editor-content .ProseMirror strong {
          font-weight: bold;
          color: #111827;
        }
        
        .substack-editor-content .ProseMirror em {
          font-style: italic;
        }
        
        .substack-editor-content .ProseMirror p:first-child {
          margin-top: 0;
        }
      `}</style>
    </div>
  );
}