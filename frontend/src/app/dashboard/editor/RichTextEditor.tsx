import { useRef, useEffect, useState } from "react";
import ImagePickerModal, { ImageAsset } from "./ImagePickerModal";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [readTime, setReadTime] = useState(0);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
      const text = editorRef.current.innerText || "";
      const words = text.trim().split(/\s+/).filter(Boolean);
      setWordCount(words.length);
      setReadTime(Math.ceil(words.length / 225)); // 225 wpm average
    }
  };

  const exec = (command: string, arg?: string) => {
    document.execCommand(command, false, arg);
    handleInput();
  };

  const handleInsertImage = (img: ImageAsset) => {
    exec("insertImage", img.image_url);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-2 bg-gray-50 p-2 rounded border shadow-sm">
        {/* Bold */}
        <button type="button" title="Bold" onClick={() => exec("bold")}
          className="hover:bg-gray-200 w-9 h-9 flex items-center justify-center rounded-full transition focus:ring-2 focus:ring-primary">
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M6 4h5a3 3 0 010 6H6zm0 6h6a3 3 0 010 6H6z" stroke="#222" strokeWidth="1.5"/></svg>
        </button>
        {/* Italic */}
        <button type="button" title="Italic" onClick={() => exec("italic")}
          className="hover:bg-gray-200 w-9 h-9 flex items-center justify-center rounded-full transition focus:ring-2 focus:ring-primary">
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M8 4h6M6 16h6M10 4l-4 12" stroke="#222" strokeWidth="1.5"/></svg>
        </button>
        {/* Underline */}
        <button type="button" title="Underline" onClick={() => exec("underline")}
          className="hover:bg-gray-200 w-9 h-9 flex items-center justify-center rounded-full transition focus:ring-2 focus:ring-primary">
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M7 4v5a3 3 0 006 0V4M5 16h10" stroke="#222" strokeWidth="1.5"/></svg>
        </button>
        {/* H1 */}
        <button type="button" title="Heading 1" onClick={() => exec("formatBlock", "<h1>")}
          className="hover:bg-gray-200 w-10 h-10 flex items-center justify-center rounded-full transition focus:ring-2 focus:ring-primary">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><text x="3" y="19" fontSize="17" fontWeight="bold" fill="#222">H1</text></svg>
        </button>
        {/* H2 */}
        <button type="button" title="Heading 2" onClick={() => exec("formatBlock", "<h2>")}
          className="hover:bg-gray-200 w-10 h-10 flex items-center justify-center rounded-full transition focus:ring-2 focus:ring-primary">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><text x="3" y="19" fontSize="17" fontWeight="bold" fill="#222">H2</text></svg>
        </button>
        {/* H3 */}
        <button type="button" title="Heading 3" onClick={() => exec("formatBlock", "<h3>")}
          className="hover:bg-gray-200 w-10 h-10 flex items-center justify-center rounded-full transition focus:ring-2 focus:ring-primary">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><text x="3" y="19" fontSize="17" fontWeight="bold" fill="#222">H3</text></svg>
        </button>
        {/* Bullet List */}
        <button type="button" title="Bullet List" onClick={() => exec("insertUnorderedList")}
          className="hover:bg-gray-200 w-9 h-9 flex items-center justify-center rounded-full transition focus:ring-2 focus:ring-primary">
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><circle cx="6" cy="7" r="1.5" fill="#222"/><circle cx="6" cy="13" r="1.5" fill="#222"/><rect x="10" y="6" width="6" height="2" fill="#222"/><rect x="10" y="12" width="6" height="2" fill="#222"/></svg>
        </button>
        {/* Numbered List */}
        <button type="button" title="Numbered List" onClick={() => exec("insertOrderedList")}
          className="hover:bg-gray-200 w-9 h-9 flex items-center justify-center rounded-full transition focus:ring-2 focus:ring-primary">
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><text x="3" y="10" fontSize="10" fill="#222">1.</text><rect x="10" y="6" width="6" height="2" fill="#222"/><text x="3" y="17" fontSize="10" fill="#222">2.</text><rect x="10" y="12" width="6" height="2" fill="#222"/></svg>
        </button>
        {/* Left Align */}
        <button type="button" title="Align Left" onClick={() => exec("justifyLeft")}
          className="hover:bg-gray-200 w-9 h-9 flex items-center justify-center rounded-full transition focus:ring-2 focus:ring-primary">
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><rect x="4" y="6" width="12" height="2" fill="#222"/><rect x="4" y="10" width="8" height="2" fill="#222"/><rect x="4" y="14" width="10" height="2" fill="#222"/></svg>
        </button>
        {/* Center Align */}
        <button type="button" title="Align Center" onClick={() => exec("justifyCenter")}
          className="hover:bg-gray-200 w-9 h-9 flex items-center justify-center rounded-full transition focus:ring-2 focus:ring-primary">
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><rect x="6" y="6" width="8" height="2" fill="#222"/><rect x="4" y="10" width="12" height="2" fill="#222"/><rect x="7" y="14" width="6" height="2" fill="#222"/></svg>
        </button>
        {/* Right Align */}
        <button type="button" title="Align Right" onClick={() => exec("justifyRight")}
          className="hover:bg-gray-200 w-9 h-9 flex items-center justify-center rounded-full transition focus:ring-2 focus:ring-primary">
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><rect x="4" y="6" width="12" height="2" fill="#222"/><rect x="8" y="10" width="8" height="2" fill="#222"/><rect x="6" y="14" width="10" height="2" fill="#222"/></svg>
        </button>
        {/* Blockquote */}
        <button type="button" title="Blockquote" onClick={() => exec("formatBlock", "<blockquote>")}
          className="hover:bg-gray-200 w-9 h-9 flex items-center justify-center rounded-full transition focus:ring-2 focus:ring-primary">
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M6 8h4v2H6zm0 4h4v2H6z" fill="#222"/><path d="M14 8h2v2h-2zm0 4h2v2h-2z" fill="#222"/></svg>
        </button>
        {/* Link */}
        <button type="button" title="Link" onClick={() => exec("createLink", prompt("Enter URL:") || "")}
          className="hover:bg-gray-200 w-9 h-9 flex items-center justify-center rounded-full transition focus:ring-2 focus:ring-primary">
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M7 10a3 3 0 013-3h2a3 3 0 110 6h-2a3 3 0 01-3-3z" stroke="#222" strokeWidth="1.5" fill="none"/><path d="M13 10a3 3 0 00-3-3H8a3 3 0 100 6h2a3 3 0 003-3z" stroke="#222" strokeWidth="1.5" fill="none"/></svg>
        </button>
        {/* Image */}
        <button type="button" title="Insert Image" onClick={() => setShowImageModal(true)}
          className="hover:bg-gray-200 w-9 h-9 flex items-center justify-center rounded-full transition focus:ring-2 focus:ring-primary">
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><rect x="3" y="3" width="14" height="14" rx="2" fill="#e5e7eb" stroke="#222" strokeWidth="1.5"/><circle cx="8" cy="8" r="2" fill="#222"/><path d="M3 17l5-5 4 4 5-7" stroke="#222" strokeWidth="1.5" fill="none"/></svg>
        </button>
      </div>
      <div
        ref={editorRef}
        className="w-full border px-3 py-2 rounded-md min-h-[200px] bg-white"
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        style={{ outline: "none" }}
      />
      <div className="flex gap-4 text-xs text-gray-500 mt-1">
        <span>{wordCount} words</span>
        <span>~{readTime} min read</span>
      </div>
      <ImagePickerModal open={showImageModal} onClose={() => setShowImageModal(false)} onSelect={handleInsertImage} />
    </div>
  );
}
