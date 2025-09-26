"use client";
import { useState } from "react";

export default function TagInput({ value, onChange }: { value: string; onChange: (tags: string) => void }) {
  const [input, setInput] = useState("");
  const tags = value.split(",").map(t => t.trim()).filter(Boolean);
  function addTag(tag: string) {
    if (!tag) return;
    const newTags = Array.from(new Set([...tags, tag])).join(", ");
    onChange(newTags);
    setInput("");
  }
  function removeTag(tag: string) {
    const newTags = tags.filter(t => t !== tag).join(", ");
    onChange(newTags);
  }
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(tag => (
        <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center gap-1">
          {tag}
          <button className="ml-1 text-xs" onClick={() => removeTag(tag)}>&times;</button>
        </span>
      ))}
      <input
        className="input"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag(input.trim());
          }
        }}
        placeholder="Add tag"
      />
    </div>
  );
}
