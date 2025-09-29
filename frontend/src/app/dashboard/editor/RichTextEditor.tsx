import { useRef, useEffect, useState } from "react";
import { useFormatState } from "./functions/useFormatState";
import { wrapLinesInBlocks } from "./functions/wrapLinesInBlocks";
import { BoldIcon, ItalicIcon, UnderlineIcon, ListBulletIcon, NumberedListIcon, LinkIcon, PhotoIcon, ChatBubbleLeftEllipsisIcon, Bars3BottomLeftIcon, Bars3BottomRightIcon, Bars3CenterLeftIcon, Bars3Icon } from "@heroicons/react/24/outline";
import ImagePickerModal from "./ImagePickerModal";
import type { ImageAsset } from "./ImagePicker";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
    const [showImageModal, setShowImageModal] = useState(false);
    const [wordCount, setWordCount] = useState(0);
    const [readTime, setReadTime] = useState(0);

  // Use custom hook for format state
  const formatState = useFormatState();

  useEffect(() => {
    if (editorRef.current) {
      // If value is plain text or only <br>s, wrap in <div>s
      let html = value;
      if (!/<(div|p|ul|ol|li|h1|h2|h3|blockquote|img|a)[\s>]/i.test(html)) {
        html = wrapLinesInBlocks(html);
      }
      if (editorRef.current.innerHTML !== html) {
        editorRef.current.innerHTML = html;
      }
    }
  }, [value]);
  // On paste, wrap plain text lines in <div> blocks
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    const html = wrapLinesInBlocks(text);
    document.execCommand("insertHTML", false, html);
    handleInput();
  };

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
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, arg);
      handleInput();
    }
  };

  const handleInsertImage = (img: ImageAsset) => {
    exec("insertImage", img.image_url);
  };

  return (
    <div>
  <div className="flex flex-wrap gap-2 md:gap-3 mb-3 bg-gray-10 p-3 rounded-xl border border-gray-100 shadow-sm">
        {/* Bold */}
        <button
          type="button"
          title="Bold"
          onClick={() => exec("bold")}
          className={`w-10 h-10 flex items-center justify-center rounded-lg transition focus:ring-2 focus:ring-primary/30 border ${formatState.bold ? "bg-primary/20 border-primary/40" : "hover:bg-primary/10 focus:bg-primary/20 border-transparent"}`}
        >
          <BoldIcon className="w-4 h-4 text-gray-800" />
        </button>
        {/* Italic */}
        <button
          type="button"
          title="Italic"
          onClick={() => exec("italic")}
          className={`w-10 h-10 flex items-center justify-center rounded-lg transition focus:ring-2 focus:ring-primary/30 border ${formatState.italic ? "bg-primary/20 border-primary/40" : "hover:bg-primary/10 focus:bg-primary/20 border-transparent"}`}
        >
          <ItalicIcon className="w-4 h-4 text-gray-800" />
        </button>
        {/* Underline */}
        <button
          type="button"
          title="Underline"
          onClick={() => exec("underline")}
          className={`w-10 h-10 flex items-center justify-center rounded-lg transition focus:ring-2 focus:ring-primary/30 border ${formatState.underline ? "bg-primary/20 border-primary/40" : "hover:bg-primary/10 focus:bg-primary/20 border-transparent"}`}
        >
          <UnderlineIcon className="w-4 h-4 text-gray-800" />
        </button>
        {/* H1 */}
        <button
          type="button"
          title="Heading 1"
          onClick={() => exec("formatBlock", "<h1>")}
          className={`w-11 h-11 flex items-center justify-center rounded-lg transition focus:ring-2 focus:ring-primary/30 border ${formatState.h1 ? "bg-primary/20 border-primary/40" : "hover:bg-primary/10 focus:bg-primary/20 border-transparent"}`}
        >
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><text x="3" y="19" fontSize="15" fontWeight="bold" fill="#222">H1</text></svg>
        </button>
        {/* H2 */}
        <button
          type="button"
          title="Heading 2"
          onClick={() => exec("formatBlock", "<h2>")}
          className={`w-11 h-11 flex items-center justify-center rounded-lg transition focus:ring-2 focus:ring-primary/30 border ${formatState.h2 ? "bg-primary/20 border-primary/40" : "hover:bg-primary/10 focus:bg-primary/20 border-transparent"}`}
        >
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><text x="3" y="19" fontSize="15" fontWeight="bold" fill="#222">H2</text></svg>
        </button>
        {/* H3 */}
        <button
          type="button"
          title="Heading 3"
          onClick={() => exec("formatBlock", "<h3>")}
          className={`w-11 h-11 flex items-center justify-center rounded-lg transition focus:ring-2 focus:ring-primary/30 border ${formatState.h3 ? "bg-primary/20 border-primary/40" : "hover:bg-primary/10 focus:bg-primary/20 border-transparent"}`}
        >
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><text x="3" y="19" fontSize="15" fontWeight="bold" fill="#222">H3</text></svg>
        </button>
        {/* Left Align */}
        <button
          type="button"
          title="Align Left"
          onClick={() => exec("justifyLeft")}
          className={`w-10 h-10 flex items-center justify-center rounded-lg transition focus:ring-2 focus:ring-primary/30 border ${formatState.left ? "bg-primary/20 border-primary/40" : "hover:bg-primary/10 focus:bg-primary/20 border-transparent"}`}
        >
          <Bars3BottomLeftIcon className="w-4 h-4 text-gray-800" />
        </button>
        {/* Center Align */}
        <button
          type="button"
          title="Align Center"
          onClick={() => exec("justifyCenter")}
          className={`w-10 h-10 flex items-center justify-center rounded-lg transition focus:ring-2 focus:ring-primary/30 border ${formatState.center ? "bg-primary/20 border-primary/40" : "hover:bg-primary/10 focus:bg-primary/20 border-transparent"}`}
        >
          <Bars3Icon className="w-4 h-4 text-gray-800" />
        </button>
        {/* Right Align */}
        <button
          type="button"
          title="Align Right"
          onClick={() => exec("justifyRight")}
          className={`w-10 h-10 flex items-center justify-center rounded-lg transition focus:ring-2 focus:ring-primary/30 border ${formatState.right ? "bg-primary/20 border-primary/40" : "hover:bg-primary/10 focus:bg-primary/20 border-transparent"}`}
        >
          <Bars3BottomRightIcon className="w-4 h-4 text-gray-800" />
        </button>
        {/* Link */}
        <button type="button" title="Link" onClick={() => exec("createLink", prompt("Enter URL:") || "")}
          className="hover:bg-primary/10 focus:bg-primary/20 w-10 h-10 flex items-center justify-center rounded-lg transition focus:ring-2 focus:ring-primary/30 border border-transparent focus:border-primary/40">
          <LinkIcon className="w-4 h-4 text-gray-800" />
        </button>
        {/* Image */}
        <button type="button" title="Insert Image" onClick={() => setShowImageModal(true)}
          className="hover:bg-primary/10 focus:bg-primary/20 w-10 h-10 flex items-center justify-center rounded-lg transition focus:ring-2 focus:ring-primary/30 border border-transparent focus:border-primary/40">
          <PhotoIcon className="w-4 h-4 text-gray-800" />
        </button>
      </div>
      <div
        ref={editorRef}
        className="w-full border border-gray-200 px-4 py-3 rounded-xl min-h-[220px] bg-white focus-within:shadow-lg focus-within:border-primary/40 transition-all"
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onPaste={handlePaste}
        onKeyDown={(e) => {
          // Allow browser default for Enter (new paragraph)
          // Only override Shift+Enter for line break
          if (e.key === "Enter" && e.shiftKey) {
            e.preventDefault();
            document.execCommand("insertLineBreak");
            return false;
          }
        }}
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
