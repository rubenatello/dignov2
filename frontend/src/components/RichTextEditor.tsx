'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import TaskList from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import { useCallback, useEffect } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
}

export default function RichTextEditor({ 
  content, 
  onChange, 
  placeholder = "Start writing your article...",
  editable = true 
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary hover:text-primary/80 underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-4',
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const addImage = useCallback(() => {
    const url = window.prompt('Enter image URL:');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href;
    const url = window.prompt('Enter URL:', previousUrl);

    if (url === null) return;

    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return <div className="animate-pulse bg-gray-100 h-64 rounded"></div>;
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {editable && (
        <div className="border-b border-gray-200 p-2 bg-gray-50 flex flex-wrap gap-1">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`px-3 py-1 rounded text-sm ${
              editor.isActive('bold') ? 'bg-primary text-white' : 'bg-white hover:bg-gray-100'
            }`}
          >
            Bold
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`px-3 py-1 rounded text-sm ${
              editor.isActive('italic') ? 'bg-primary text-white' : 'bg-white hover:bg-gray-100'
            }`}
          >
            Italic
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`px-3 py-1 rounded text-sm ${
              editor.isActive('strike') ? 'bg-primary text-white' : 'bg-white hover:bg-gray-100'
            }`}
          >
            Strike
          </button>
          
          <div className="border-l border-gray-300 mx-1"></div>
          
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`px-3 py-1 rounded text-sm ${
              editor.isActive('heading', { level: 1 }) ? 'bg-primary text-white' : 'bg-white hover:bg-gray-100'
            }`}
          >
            H1
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-3 py-1 rounded text-sm ${
              editor.isActive('heading', { level: 2 }) ? 'bg-primary text-white' : 'bg-white hover:bg-gray-100'
            }`}
          >
            H2
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`px-3 py-1 rounded text-sm ${
              editor.isActive('heading', { level: 3 }) ? 'bg-primary text-white' : 'bg-white hover:bg-gray-100'
            }`}
          >
            H3
          </button>
          
          <div className="border-l border-gray-300 mx-1"></div>
          
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`px-3 py-1 rounded text-sm ${
              editor.isActive('bulletList') ? 'bg-primary text-white' : 'bg-white hover:bg-gray-100'
            }`}
          >
            Bullet List
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`px-3 py-1 rounded text-sm ${
              editor.isActive('orderedList') ? 'bg-primary text-white' : 'bg-white hover:bg-gray-100'
            }`}
          >
            Numbered List
          </button>
          
          <div className="border-l border-gray-300 mx-1"></div>
          
          <button
            onClick={setLink}
            className={`px-3 py-1 rounded text-sm ${
              editor.isActive('link') ? 'bg-primary text-white' : 'bg-white hover:bg-gray-100'
            }`}
          >
            Link
          </button>
          <button
            onClick={addImage}
            className="px-3 py-1 rounded text-sm bg-white hover:bg-gray-100"
          >
            Image
          </button>
          
          <div className="border-l border-gray-300 mx-1"></div>
          
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`px-3 py-1 rounded text-sm ${
              editor.isActive('blockquote') ? 'bg-primary text-white' : 'bg-white hover:bg-gray-100'
            }`}
          >
            Quote
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`px-3 py-1 rounded text-sm ${
              editor.isActive('codeBlock') ? 'bg-primary text-white' : 'bg-white hover:bg-gray-100'
            }`}
          >
            Code
          </button>
        </div>
      )}
      
      <EditorContent 
        editor={editor} 
        className="min-h-[400px] bg-white"
      />
    </div>
  );
}