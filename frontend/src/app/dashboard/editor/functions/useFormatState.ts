// Custom hook to track formatting state for a contenteditable div
import { useEffect, useState } from "react";

export interface FormatState {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  h1: boolean;
  h2: boolean;
  h3: boolean;
  blockquote: boolean;
  unorderedList: boolean;
  orderedList: boolean;
  left: boolean;
  center: boolean;
  right: boolean;
}

const isBrowser = typeof window !== "undefined" && typeof document !== "undefined";

export function useFormatState() {
  const [formatState, setFormatState] = useState<FormatState>({
    bold: false,
    italic: false,
    underline: false,
    h1: false,
    h2: false,
    h3: false,
    blockquote: false,
    unorderedList: false,
    orderedList: false,
    left: false,
    center: false,
    right: false,
  });

  useEffect(() => {
    if (!isBrowser) return;
    const handler = () => {
      setFormatState({
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
        underline: document.queryCommandState("underline"),
        h1: document.queryCommandValue("formatBlock") === "h1",
        h2: document.queryCommandValue("formatBlock") === "h2",
        h3: document.queryCommandValue("formatBlock") === "h3",
        blockquote: document.queryCommandValue("formatBlock") === "blockquote",
        unorderedList: document.queryCommandState("insertUnorderedList"),
        orderedList: document.queryCommandState("insertOrderedList"),
        left: document.queryCommandState("justifyLeft"),
        center: document.queryCommandState("justifyCenter"),
        right: document.queryCommandState("justifyRight"),
      });
    };
    document.addEventListener("selectionchange", handler);
    return () => document.removeEventListener("selectionchange", handler);
  }, []);

  return formatState;
}
