import React, { useState, useRef } from "react";
import type { Editor } from "@tiptap/react";

interface TiptapToolbarProps {
	editor: Editor;
}

function Divider() {
	return <div className="w-px h-7 bg-slate-200 mx-2" />;
}

function ToolbarButton({
	onClick,
	isActive,
	label,
	children,
	className = "",
	disabled = false,
}: {
	onClick: () => void;
	isActive?: boolean;
	label: string;
	children: React.ReactNode;
	className?: string;
	disabled?: boolean;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			aria-label={label}
			className={`p-2 rounded-lg transition-colors duration-100 flex items-center justify-center border border-transparent hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
				isActive ? "bg-blue-100 border-blue-400" : ""
			} ${className}`}
			tabIndex={0}
		>
			{children}
		</button>
	);
}

export default function TiptapToolbar({ editor }: TiptapToolbarProps) {
	const [showLinkInput, setShowLinkInput] = useState(false);
	const [linkUrl, setLinkUrl] = useState("");
	const linkInputRef = useRef<HTMLInputElement>(null);

	// Link bubble logic
	const handleSetLink = () => {
		if (linkUrl) {
			editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run();
		}
		setShowLinkInput(false);
		setLinkUrl("");
	};

	const handleRemoveLink = () => {
		editor.chain().focus().unsetLink().run();
		setShowLinkInput(false);
		setLinkUrl("");
	};

	return (
		<nav className="relative z-10 w-full overflow-x-auto bg-white/80 backdrop-blur-md border border-slate-200 rounded-xl px-2 py-1 flex items-center gap-1 shadow-sm mb-2 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent">
			{/* Text formatting */}
			<ToolbarButton
				onClick={() => editor.chain().focus().toggleBold().run()}
				isActive={editor.isActive("bold")}
				label="Bold"
			>
				<svg width="16" height="16" fill="none" stroke="#2563eb" strokeWidth="1.2" viewBox="0 0 24 24"><path d="M7 6h6a3 3 0 0 1 0 6H7zm0 6h7a3 3 0 0 1 0 6H7z"/></svg>
			</ToolbarButton>
			<ToolbarButton
				onClick={() => editor.chain().focus().toggleItalic().run()}
				isActive={editor.isActive("italic")}
				label="Italic"
			>
				<svg width="16" height="16" fill="none" stroke="#2563eb" strokeWidth="1.2" viewBox="0 0 24 24"><path d="M10 5h8M6 19h8M14 5l-4 14"/></svg>
			</ToolbarButton>
			<ToolbarButton
				onClick={() => editor.chain().focus().toggleUnderline().run()}
				isActive={editor.isActive("underline")}
				label="Underline"
			>
				<svg width="16" height="16" fill="none" stroke="#2563eb" strokeWidth="1.2" viewBox="0 0 24 24"><path d="M6 4v6a6 6 0 0 0 12 0V4"/><path d="M4 20h16"/></svg>
			</ToolbarButton>
			<ToolbarButton
				onClick={() => editor.chain().focus().toggleStrike().run()}
				isActive={editor.isActive("strike")}
				label="Strikethrough"
			>
				<svg width="16" height="16" fill="none" stroke="#2563eb" strokeWidth="1.2" viewBox="0 0 24 24"><path d="M6 12h12"/><path d="M12 4v16"/></svg>
			</ToolbarButton>
			<Divider />

			{/* Headings */}
					{[1, 2, 3].map((level) => (
						<ToolbarButton
							key={level}
							onClick={() => editor.chain().focus().toggleHeading({ level: level as any }).run()}
							isActive={editor.isActive("heading", { level })}
							label={`Heading ${level}`}
						>
							<svg width="18" height="18" fill="none" stroke="#2563eb" strokeWidth="1.5" viewBox="0 0 24 24">
								<text x="2" y="17" fontSize="13" fontWeight="bold" fill="#2563eb">H</text>
								<text x="13" y="17" fontSize="13" fontWeight="bold" fill="#2563eb">{level}</text>
							</svg>
						</ToolbarButton>
					))}
			<Divider />

			{/* Lists */}
			<ToolbarButton
				onClick={() => editor.chain().focus().toggleBulletList().run()}
				isActive={editor.isActive("bulletList")}
				label="Bullet List"
			>
				<svg width="18" height="18" fill="none" stroke="#2563eb" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="7" cy="7" r="2"/><circle cx="7" cy="12" r="2"/><circle cx="7" cy="17" r="2"/><path d="M11 7h7M11 12h7M11 17h7"/></svg>
			</ToolbarButton>
			<ToolbarButton
				onClick={() => editor.chain().focus().toggleOrderedList().run()}
				isActive={editor.isActive("orderedList")}
				label="Numbered List"
			>
				<svg width="18" height="18" fill="none" stroke="#2563eb" strokeWidth="1.5" viewBox="0 0 24 24"><text x="4" y="10" fontSize="7" fill="#2563eb">1</text><text x="4" y="16" fontSize="7" fill="#2563eb">2</text><text x="4" y="22" fontSize="7" fill="#2563eb">3</text><path d="M11 8h8M11 14h8M11 20h8"/></svg>
			</ToolbarButton>
			<Divider />

			{/* Alignment */}
			<ToolbarButton
				onClick={() => editor.chain().focus().setTextAlign("left").run()}
				isActive={editor.isActive({ textAlign: "left" })}
				label="Align Left"
			>
				<svg width="18" height="18" fill="none" stroke="#2563eb" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="4" y="7" width="16" height="2" rx="1"/><rect x="4" y="11" width="10" height="2" rx="1"/><rect x="4" y="15" width="7" height="2" rx="1"/></svg>
			</ToolbarButton>
			<ToolbarButton
				onClick={() => editor.chain().focus().setTextAlign("center").run()}
				isActive={editor.isActive({ textAlign: "center" })}
				label="Align Center"
			>
				<svg width="18" height="18" fill="none" stroke="#2563eb" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="4" y="7" width="16" height="2" rx="1"/><rect x="7" y="11" width="10" height="2" rx="1"/><rect x="9" y="15" width="6" height="2" rx="1"/></svg>
			</ToolbarButton>
			<ToolbarButton
				onClick={() => editor.chain().focus().setTextAlign("right").run()}
				isActive={editor.isActive({ textAlign: "right" })}
				label="Align Right"
			>
				<svg width="18" height="18" fill="none" stroke="#2563eb" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="4" y="7" width="16" height="2" rx="1"/><rect x="10" y="11" width="10" height="2" rx="1"/><rect x="13" y="15" width="7" height="2" rx="1"/></svg>
			</ToolbarButton>
			<Divider />

			{/* Link */}
			<ToolbarButton
				onClick={() => {
					setShowLinkInput(true);
					setTimeout(() => linkInputRef.current?.focus(), 100);
				}}
				isActive={editor.isActive("link")}
				label="Insert Link"
			>
				<svg width="18" height="18" fill="none" stroke="#2563eb" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l2-2a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-2 2a5 5 0 0 0 7.07 7.07l1.72-1.71" /></svg>
			</ToolbarButton>
			{editor.isActive("link") && (
				<ToolbarButton
					onClick={handleRemoveLink}
					label="Remove Link"
					className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
				>
					<svg width="18" height="18" fill="none" stroke="#e11d48" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l2-2a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-2 2a5 5 0 0 0 7.07 7.07l1.72-1.71" /><line x1="4" y1="20" x2="20" y2="4" /></svg>
				</ToolbarButton>
			)}
			{showLinkInput && (
				<div className="absolute left-1/2 top-full mt-2 -translate-x-1/2 bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3 flex items-center gap-2 z-50 animate-fade-in">
					<input
						ref={linkInputRef}
						type="url"
						value={linkUrl}
						onChange={e => setLinkUrl(e.target.value)}
						onKeyDown={e => {
							if (e.key === "Enter") handleSetLink();
							if (e.key === "Escape") setShowLinkInput(false);
						}}
						className="px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 text-sm w-56"
						placeholder="Paste or type a link..."
						autoFocus
					/>
					<button
						onClick={handleSetLink}
						className="px-2 py-1 text-blue-600 hover:text-blue-800 text-xs font-semibold"
					>Save</button>
					<button
						onClick={handleRemoveLink}
						className="px-2 py-1 text-rose-500 hover:text-rose-700 text-xs font-semibold"
					>Remove</button>
				</div>
			)}
			<Divider />

			{/* Blockquote, code, code block */}
			<ToolbarButton
				onClick={() => editor.chain().focus().toggleBlockquote().run()}
				isActive={editor.isActive("blockquote")}
				label="Quote"
			>
				<svg width="18" height="18" fill="none" stroke="#2563eb" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M7 17h6M7 13h6M7 9h6M17 9v8"/></svg>
			</ToolbarButton>
			<ToolbarButton
				onClick={() => editor.chain().focus().toggleCode().run()}
				isActive={editor.isActive("code")}
				label="Inline Code"
			>
				<svg width="18" height="18" fill="none" stroke="#2563eb" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M8 17l-4-4 4-4M16 7l4 4-4 4"/></svg>
			</ToolbarButton>
			<ToolbarButton
				onClick={() => editor.chain().focus().toggleCodeBlock().run()}
				isActive={editor.isActive("codeBlock")}
				label="Code Block"
			>
				<svg width="18" height="18" fill="none" stroke="#2563eb" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="4" y="6" width="16" height="12" rx="2"/><path d="M8 10l-2 2 2 2M16 10l2 2-2 2"/></svg>
			</ToolbarButton>
			<Divider />

			{/* Table */}
			<ToolbarButton
				onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
				label="Insert Table"
			>
				<svg width="18" height="18" fill="none" stroke="#2563eb" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="4" y="6" width="16" height="12" rx="2"/><path d="M4 10h16M4 14h16M8 6v12M16 6v12"/></svg>
			</ToolbarButton>
			<Divider />

			{/* Image */}
			<ToolbarButton
				onClick={() => editor.commands.focus() || editor.commands.setImage?.({ src: "" })}
				label="Insert Image"
			>
				<svg width="18" height="18" fill="none" stroke="#2563eb" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" ry="2" /><circle cx="8" cy="11" r="2" /><path d="M21 15l-5-5L5 21" /></svg>
			</ToolbarButton>
			<Divider />

			{/* Undo/Redo */}
			<ToolbarButton
				onClick={() => editor.chain().focus().undo().run()}
				label="Undo"
				disabled={!editor.can().undo()}
			>
				<svg width="18" height="18" fill="none" stroke="#2563eb" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 19c-4.418 0-8-3.582-8-8s3.582-8 8-8c2.21 0 4.21.896 5.656 2.344M12 3v4m0 0l-4-4m4 4l4-4" /></svg>
			</ToolbarButton>
			<ToolbarButton
				onClick={() => editor.chain().focus().redo().run()}
				label="Redo"
				disabled={!editor.can().redo()}
			>
				<svg width="18" height="18" fill="none" stroke="#2563eb" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 5c4.418 0 8 3.582 8 8s-3.582 8-8 8c-2.21 0-4.21-.896-5.656-2.344M12 21v-4m0 0l4 4m-4-4l-4 4" /></svg>
			</ToolbarButton>
		</nav>
	);
}

