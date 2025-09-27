// Ensures pasted or entered plain text is wrapped in <div> blocks for contenteditable
export function wrapLinesInBlocks(html: string): string {
  // Split by <br> or newlines, filter out empty lines
  const lines = html
    .replace(/\r/g, "")
    .split(/<br\s*\/?>|\n/)
    .map(line => line.trim())
    .filter(Boolean);
  // Wrap each line in a <div>
  return lines.map(line => `<div>${line}</div>`).join("");
}
