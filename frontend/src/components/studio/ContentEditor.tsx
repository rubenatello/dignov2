import React from "react";
import { EditorContent } from "@tiptap/react";
import TiptapToolbar from "./TiptapToolbar";

interface ContentEditorProps {
  editor: any;
  onImageDrop: (e: React.DragEvent) => void;
}

export default function ContentEditor({ editor, onImageDrop }: ContentEditorProps) {
  return (
    <section className="mb-12 group">
      <div className="relative w-full">
        <TiptapToolbar editor={editor} />
        <div
          className="border border-slate-200 rounded-xl bg-white/80 focus-within:ring-2 focus-within:ring-blue-400 transition-shadow min-h-[320px] max-w-full mt-2 px-4 py-3 overflow-x-auto"
          id="studio-editor-content"
          onDrop={async (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            if (!editor) return;
            const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
            if (files.length === 0) return;
            const file = files[0];
            const formData = new FormData();
            formData.append('image', file);
            try {
              const res = await fetch('/api/studio/images/', {
                method: 'POST',
                body: formData,
              });
              if (!res.ok) throw new Error('Upload failed');
              const data = await res.json();
              const imageUrl = data.image_url || data.url || data.image || '';
              if (imageUrl) {
                editor.chain().focus().setImage({ src: imageUrl }).run();
              }
            } catch (err) {
              console.error('Image upload failed', err);
            }
          }}
          onDragOver={e => e.preventDefault()}
          onClick={() => editor?.chain().focus().run()}
        >
          {/* Apply prose class directly to ProseMirror for correct formatting */}
          {editor && (
            <EditorContent editor={editor} className="ProseMirror prose prose-blue dark:prose-invert outline-none min-h-[240px] bg-transparent" />
          )}
        </div>
      </div>
    </section>
  );
}
