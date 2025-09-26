"use client";
import { useEffect, useState } from "react";
import { listImages } from "@/services/images";
import type { ImageAsset } from "@/types/image";

export default function MediaLibraryModal({ open, onClose, onSelect }: { open: boolean; onClose: () => void; onSelect: (asset: ImageAsset) => void; }) {
  const [q, setQ] = useState("");
  const [images, setImages] = useState<ImageAsset[]>([]);
  useEffect(() => { if (open) listImages(q).then(r => setImages(r.results)); }, [open, q]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/30 p-6">
      <div className="bg-white rounded-2xl p-4 max-w-4xl mx-auto">
        <input className="input" placeholder="Search" value={q} onChange={e=>setQ(e.target.value)} />
        <div className="grid grid-cols-4 gap-3 mt-4 max-h-[60vh] overflow-auto">
          {images.map(img => (
            <button key={img.id} onClick={()=>{ onSelect(img); onClose(); }} className="border rounded">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.image_url} alt={img.alt_text} className="w-full h-32 object-cover" />
              <div className="text-xs p-1 line-clamp-2">{img.description}</div>
            </button>
          ))}
        </div>
        <div className="mt-4 text-right"><button onClick={onClose} className="btn">Close</button></div>
      </div>
    </div>
  );
}
