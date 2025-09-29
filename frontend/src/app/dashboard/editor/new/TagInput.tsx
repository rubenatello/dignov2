import React, { useState, KeyboardEvent, useEffect, useRef } from "react";
import { fetchTagSuggestions } from "@/lib/api/tags";

interface TagInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
  placeholder?: string;
}

const TagInput: React.FC<TagInputProps> = ({ tags, setTags, placeholder }) => {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setShowSuggestions(false);
    setHighlighted(-1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (showSuggestions && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
      setHighlighted((prev) => {
        if (suggestions.length === 0) return -1;
        if (e.key === "ArrowDown") return prev < suggestions.length - 1 ? prev + 1 : 0;
        if (e.key === "ArrowUp") return prev > 0 ? prev - 1 : suggestions.length - 1;
        return prev;
      });
      return;
    }
    if (e.key === "Enter" && showSuggestions && highlighted >= 0) {
      e.preventDefault();
      addTag(suggestions[highlighted]);
      setInput("");
      return;
    }
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      addTag(input);
      setInput("");
    }
    if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  useEffect(() => {
    if (input.trim()) {
      fetchTagSuggestions(input.trim()).then((results) => {
        // Only show suggestions not already in tags
        setSuggestions(results.map((r: any) => r.name).filter((name: string) => !tags.includes(name)));
        setShowSuggestions(true);
        setHighlighted(-1);
      });
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setHighlighted(-1);
    }
  }, [input, tags]);

  return (
    <div className="relative flex flex-wrap items-center gap-2 border border-gray-200 rounded-lg px-2 py-2 bg-white/80 focus-within:ring-2 focus-within:ring-primary/30 transition">
      {tags.map((tag) => (
        <span key={tag} className="flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-xs font-medium mr-1 mb-1">
          {tag}
          <button
            type="button"
            className="ml-2 text-blue-400 hover:text-red-500 focus:outline-none"
            onClick={() => removeTag(tag)}
            aria-label={`Remove tag ${tag}`}
          >
            ×
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        type="text"
        className="flex-1 min-w-[120px] border-none bg-transparent focus:outline-none text-sm px-2 py-1"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || "Add a tag..."}
        autoComplete="off"
        onFocus={() => input && setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute left-0 top-full z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
          {suggestions.map((sugg, idx) => (
            <li
              key={sugg}
              className={`px-4 py-2 cursor-pointer hover:bg-blue-100 ${highlighted === idx ? "bg-blue-100" : ""}`}
              onMouseDown={() => {
                addTag(sugg);
                setInput("");
              }}
              onMouseEnter={() => setHighlighted(idx)}
            >
              {sugg}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TagInput;
