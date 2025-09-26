import { useRef, useEffect, useState } from "react";
import ImagePickerModal, { ImageAsset } from "./ImagePickerModal";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
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
      <div className="flex flex-wrap gap-2 mb-2 bg-gray-50 p-2 rounded border">
        <button type="button" onClick={() => exec("bold")}>B</button>
        <button type="button" onClick={() => exec("italic")}>I</button>
        <button type="button" onClick={() => exec("underline")}>U</button>
        <button type="button" onClick={() => exec("insertOrderedList")}>OL</button>
        <button type="button" onClick={() => exec("insertUnorderedList")}>UL</button>
        <button type="button" onClick={() => exec("justifyLeft")}>Left</button>
        <button type="button" onClick={() => exec("justifyCenter")}>Center</button>
        <button type="button" onClick={() => exec("justifyRight")}>Right</button>
        <button type="button" onClick={() => exec("formatBlock", "<h2>")}>H2</button>
        <button type="button" onClick={() => exec("formatBlock", "<h3>")}>H3</button>
        <button type="button" onClick={() => exec("createLink", prompt("Enter URL:") || "")}>Link</button>
        <button type="button" onClick={() => exec("insertHorizontalRule")}>Divider</button>
        <button type="button" onClick={() => setShowImageModal(true)}>Image</button>
      </div>
      <div
        ref={editorRef}
        className="w-full border px-3 py-2 rounded-md min-h-[200px] bg-white"
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        style={{ outline: "none" }}
      />
      <ImagePickerModal open={showImageModal} onClose={() => setShowImageModal(false)} onSelect={handleInsertImage} />
    </div>
  );
}
