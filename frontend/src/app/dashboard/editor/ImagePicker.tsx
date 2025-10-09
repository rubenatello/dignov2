import { useEffect, useState } from "react";
import { fixMediaUrl } from "@/lib/media";

export interface ImageAsset {
  id: number;
  title: string;
  description: string;
  alt_text: string;
  source: string;
  image_url: string;
  formatted_caption: string;
}

interface ImagePickerProps {
  value: number | null;
  onChange: (id: number | null, image?: ImageAsset) => void;
  showUpload?: boolean;
}

export default function ImagePicker({ value, onChange, showUpload }: ImagePickerProps) {
  const [images, setImages] = useState<ImageAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const pageSize = 8;

  useEffect(() => {
    setLoading(true);
    fetch(`/api/images/?search=${encodeURIComponent(search)}&limit=${pageSize}&offset=${(page-1)*pageSize}`)
      .then(res => res.json())
      .then(data => {
        setImages(data.results || []);
        setCount(data.count || 0);
      })
      .finally(() => setLoading(false));
  }, [search, page]);

  const totalPages = Math.ceil(count / pageSize);

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          placeholder="Search images..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="border px-2 py-1 rounded w-full"
        />
      </div>
      {loading ? (
        <div>Loading images…</div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map(img => (
              <div
                key={img.id}
                className={`border rounded p-2 cursor-pointer ${value === img.id ? "ring-2 ring-primary" : ""}`}
                onClick={() => onChange(img.id, img)}
                title={img.formatted_caption}
              >
                <img src={fixMediaUrl(img.image_url)} alt={img.alt_text} className="w-full h-24 object-cover rounded mb-1" />
                <div className="text-xs font-semibold truncate">{img.title}</div>
                <div className="text-xs text-gray-500 truncate">{img.source}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-4">
            <button disabled={page === 1} onClick={() => setPage(page-1)} className="px-2 py-1 rounded border disabled:opacity-50">Prev</button>
            <span className="text-xs">Page {page} of {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage(page+1)} className="px-2 py-1 rounded border disabled:opacity-50">Next</button>
          </div>
        </>
      )}
    </div>
  );
}
