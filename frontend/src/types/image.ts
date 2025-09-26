export type ImageAsset = {
  id: number;
  image_url: string;
  title: string;
  description: string;
  alt_text: string;
  source: string;
  source_url?: string | null;
  width?: number | null;
  height?: number | null;
};
