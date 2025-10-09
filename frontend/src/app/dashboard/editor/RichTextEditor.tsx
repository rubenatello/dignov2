import { useRef, useEffect, useState } from "react";
import { useFormatState } from "./functions/useFormatState";
import { wrapLinesInBlocks } from "./functions/wrapLinesInBlocks";
import { BoldIcon, ItalicIcon, UnderlineIcon, ListBulletIcon, NumberedListIcon, LinkIcon, PhotoIcon, ChatBubbleLeftEllipsisIcon, Bars3BottomLeftIcon, Bars3BottomRightIcon, Bars3CenterLeftIcon, Bars3Icon } from "@heroicons/react/24/outline";
import ImagePickerModal from "./ImagePickerModal";
import type { ImageAsset } from "./ImagePicker";
import { fixMediaUrl } from "@/lib/media";

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
    if (!editorRef.current) return;
    editorRef.current.focus();
    const url = fixMediaUrl(img.image_url);
    // Insert wrapped figure with centered image and a resize handle
    const safe = (s: string) => (s || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const captionText = img.formatted_caption || [img.description, img.source].filter(Boolean).join(' — ');
    const html = `
      <figure class="rte-img" data-type="image">
        <img src="${url}" alt="${(img.alt_text || '').replace(/"/g, '&quot;')}" style="max-width:100%;height:auto;display:block;margin:0 auto;" />
        ${captionText ? `<figcaption class="rte-caption">${safe(captionText)}</figcaption>` : ''}
        <span class="rte-resize-handle" contenteditable="false"></span>
      </figure>
      <div><br/></div>
    `;
    document.execCommand("insertHTML", false, html);
    handleInput();
  };

  // Enable image selection and drag-to-resize via a corner handle
  useEffect(() => {
    const root = editorRef.current;
    if (!root) return;

    let isResizing = false;
    let startX = 0;
    let startWidth = 0;
    let currentImg: HTMLImageElement | null = null;

    const onClick = (e: MouseEvent) => {
      if (!root) return;
      const target = e.target as HTMLElement;
      const fig = target.closest('figure.rte-img');
      // Toggle selection outline for clicked figure
      root.querySelectorAll('figure.rte-img.selected').forEach(f => f.classList.remove('selected'));
      if (fig) fig.classList.add('selected');
    };

    const onMouseDown = (e: MouseEvent) => {
      const handle = (e.target as HTMLElement).closest('.rte-resize-handle');
      if (!handle) return;
      const fig = (handle as HTMLElement).closest('figure.rte-img') as HTMLElement | null;
      if (!fig) return;
      const img = fig.querySelector('img') as HTMLImageElement | null;
      if (!img) return;
      isResizing = true;
      currentImg = img;
      startX = e.clientX;
      startWidth = img.getBoundingClientRect().width;
      e.preventDefault();
      e.stopPropagation();
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isResizing || !currentImg || !root) return;
      const dx = e.clientX - startX;
      const parent = currentImg.parentElement as HTMLElement | null;
      const parentWidth = parent ? parent.getBoundingClientRect().width : root.getBoundingClientRect().width;
      let newWidth = startWidth + dx;
      const min = 120;
      const max = parentWidth;
      if (newWidth < min) newWidth = min;
      if (newWidth > max) newWidth = max;
      currentImg.style.width = `${Math.round(newWidth)}px`;
      currentImg.style.maxWidth = '100%';
      currentImg.style.height = 'auto';
    };

    const onMouseUp = () => {
      if (!isResizing) return;
      isResizing = false;
      currentImg = null;
      // Persist changes
      handleInput();
    };

    root.addEventListener('click', onClick);
    root.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      root.removeEventListener('click', onClick);
      root.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

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
        className="rte-content w-full border border-gray-200 px-4 py-3 rounded-xl min-h-[220px] bg-white focus-within:shadow-lg focus-within:border-primary/40 transition-all"
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
          // If an image figure is selected, allow Backspace/Delete to remove it
          if ((e.key === 'Backspace' || e.key === 'Delete') && editorRef.current) {
            const root = editorRef.current;
            const selectedFig = root.querySelector('figure.rte-img.selected');
            if (selectedFig) {
              e.preventDefault();
              const nextFocus = selectedFig.nextSibling as HTMLElement | null;
              selectedFig.remove();
              // Move caret to next block if possible
              if (nextFocus) {
                // Leaving caret placement to browser; ensure content remains editable
              }
              handleInput();
              return false;
            }
            // If caret is adjacent to a figure, remove that figure
            const sel = window.getSelection();
            if (sel && sel.rangeCount > 0) {
              const range = sel.getRangeAt(0);
              const findTopChild = (node: Node | null): Node | null => {
                let n: Node | null = node;
                while (n && n.parentNode !== root) n = n.parentNode;
                return n;
              };
              const top = findTopChild(range.startContainer);
              if (top) {
                if (e.key === 'Backspace') {
                  const prev = (top as any).previousSibling as (Element | null);
                  if (prev && prev instanceof Element && prev.matches('figure.rte-img')) {
                    e.preventDefault();
                    prev.remove();
                    handleInput();
                    return false;
                  }
                } else if (e.key === 'Delete') {
                  const next = (top as any).nextSibling as (Element | null);
                  if (next && next instanceof Element && next.matches('figure.rte-img')) {
                    e.preventDefault();
                    next.remove();
                    handleInput();
                    return false;
                  }
                }
              }
            }
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
