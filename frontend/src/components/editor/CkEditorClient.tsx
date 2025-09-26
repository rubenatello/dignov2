"use client";
import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import { patchArticle } from "@/services/articles";
import { uploadImage } from "@/services/images";

const DecoupledEditor = dynamic(() => import("@ckeditor/ckeditor5-build-decoupled-document"), { ssr: false });
const CKEditor = dynamic(() => import("@ckeditor/ckeditor5-react").then(m => m.CKEditor), { ssr: false });

type Props = { articleId: number|string; initialHTML: string };

export default function CkEditorClient({ articleId, initialHTML }: Props) {
  const [data, setData] = useState(initialHTML);
  const saveTimer = useRef<NodeJS.Timeout | null>(null);

  const autosave = useCallback((html: string) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      patchArticle(articleId, { content: html }).catch(() => {/* show toast */});
    }, 1500);
  }, [articleId]);

  const createUploadAdapter = useCallback((loader: any) => ({
    upload: async () => {
      const file = await loader.file;
      const form = new FormData();
      form.append("image", file);
      form.append("title", file.name);
      const asset = await uploadImage(form);
      (loader as any)._asset = asset;
      return { default: asset.image_url };
    },
    abort: () => {/* noop */},
  }), []);

  const onReady = useCallback((editor: any) => {
    const toolbarEl = editor.ui.view.toolbar.element;
    const editableEl = editor.ui.getEditableElement();
    editableEl.parentElement!.insertBefore(toolbarEl, editableEl);
    editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => createUploadAdapter(loader);
    editor.plugins.get("FileRepository").on("uploadComplete", (_: any, { loader }: any) => {
      const asset = (loader as any)._asset;
      if (!asset) return;
      const captionText = asset.description + (asset.source ? ` Photo: ${asset.source}` : "");
      const selection = editor.model.document.selection;
      const imageElement = selection.getSelectedElement();
      if (!imageElement) return;
      editor.model.change((writer: any) => {
        const caption = Array.from(imageElement.getChildren()).find((c: any) => c.name === 'caption');
        if (caption) writer.insertText(captionText, caption, 0);
      });
    });
  }, [createUploadAdapter]);

  return (
    <div className="prose max-w-none">
      <CKEditor
        editor={DecoupledEditor as any}
        data={data}
        onReady={onReady}
        onChange={(_, editor: any) => {
          const html = editor.getData();
          setData(html);
          autosave(html);
        }}
        config={{
          placeholder: "Write your article…",
          image: { toolbar: ["imageStyle:alignLeft","imageStyle:alignCenter","imageStyle:alignRight","|","toggleImageCaption","imageTextAlternative"] },
          toolbar: { items: ["heading","|","bold","italic","underline","link","bulletedList","numberedList","blockQuote","insertTable","imageUpload","undo","redo"] },
          link: { addTargetToExternalLinks: true },
        }}
      />
    </div>
  );
}
