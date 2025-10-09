import { useCallback, useMemo, useState } from "react";
import api from "@/lib/api";
import { formatDateTimeForBackend } from "@/lib/dateUtils";
import { toast } from "@/components/ui/Toast";

type SlugResolveAction = "overwrite" | "back" | "next";

type SlugConflictState = {
  isOpen: boolean;
  currentSlug: string;
  title: string;
  baseSlug: string;
  onResolve: (action: SlugResolveAction) => Promise<void>;
};

type FormDataShape = Record<string, any>;

/** Helper: simple slugify (avoid new deps) */
function simpleSlugify(input: string): string {
  return String(input || "")
    .toLowerCase()
    .normalize("NFKD") // split accented characters
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9]+/g, "-") // non-alnum -> dash
    .replace(/^-+|-+$/g, "") // trim dashes
    .replace(/-{2,}/g, "-"); // collapse
}

/** Helper: take only last path segment if a path-like slug was provided */
function sanitizeSlug(rawSlugOrTitle: string): string {
  const raw = String(rawSlugOrTitle || "");
  const last = raw.split("/").filter(Boolean).pop() || raw;
  return simpleSlugify(last);
}

/** Helper: normalize tags into string[] */
function normalizeTags(tags: unknown): string[] {
  if (Array.isArray(tags)) return tags.filter(Boolean).map(String);
  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
}

/** Helper: build payload consistently */
function buildPayload(formData: FormDataShape) {
  const desired = formData.slug ? String(formData.slug) : String(formData.title || "");
  const cleanSlug = sanitizeSlug(desired);
  return {
    ...formData,
    slug: cleanSlug,
    tags: normalizeTags(formData.tags),
    scheduled_publish_time: formatDateTimeForBackend(
      formData.scheduled_publish_time
    ),
    published_date: formatDateTimeForBackend(formData.published_date),
  };
}

/** Helper: get next available slug: baseSlug-1, -2, ... */
async function getNextAvailableSlug(baseSlug: string): Promise<string> {
  let suffix = 1;
  let candidate = `${baseSlug}-${suffix}`;
  // Guardrail to avoid accidental infinite loops
  const MAX_TRIES = 500;
  // eslint-disable-next-line no-constant-condition
  for (let i = 0; i < MAX_TRIES; i++) {
    try {
  const res = await api.get(`/articles/exists/?slug=${candidate}`);
      const exists = Boolean(res?.data?.exists);
      if (!exists) return candidate;
      suffix += 1;
      candidate = `${baseSlug}-${suffix}`;
    } catch {
      // 404/Not Found -> available
      return candidate;
    }
  }
  // Fallback if something is really odd
  return `${baseSlug}-${Date.now()}`;
}

export function useArticleSave(
  formData: FormDataShape,
  setFormData: (updater: any) => void,
  setLoading: (val: boolean) => void,
  router: { push: (path: string) => void },
  originalSlug?: string | null,
  setOriginalSlug?: (slug: string | null) => void
) {
  const [slugConflict, setSlugConflict] = useState<SlugConflictState>({
    isOpen: false,
    currentSlug: "",
    title: "",
    baseSlug: "",
    onResolve: async () => {},
  });

  /** Precomputed payload (stable per deps) */
  const payload = useMemo(() => buildPayload(formData), [formData]);

  /**
   * Save flow:
   * - If editing (originalSlug or id present): perform PUT (update) by originalSlug or current slug.
   * - Else (creating): preflight slug and POST; on conflict, open dialog.
   */
  const handleSave = useCallback(
    async (isRetry = false) => {
      // Client-side preflight: enforce summary length <= 300
      const summaryLen = String(formData.summary || "").length;
      if (summaryLen > 300) {
        toast("Summary must be 300 characters or fewer.", "error");
        setFormData((prev: any) => ({
          ...prev,
          error: "summary: Ensure this field has no more than 300 characters.",
        }));
        return;
      }
      setLoading(true);
      try {
        const isEditing = Boolean(originalSlug || formData.id);
        if (isEditing) {
          // Update existing article
          const targetSlug = String(originalSlug || payload.slug || "");
          await api.put(`/articles/${targetSlug}/`, payload);
          toast("Your article has been saved!", "success");
          // If slug changed, update originalSlug so future updates target the new slug
          if (setOriginalSlug) setOriginalSlug(String(payload.slug || ""));
          router.push(`/dashboard/editor`);
          return;
        }

        // Creating a new article: preflight slug existence
        const slugToCheck = String(payload.slug || "");
        // Create the article; if it fails due to slug uniqueness, auto-overwrite
        let response;
        try {
          response = await api.post("/articles/", payload);
        } catch (err: any) {
          const msg = String(err?.response?.data || err?.message || "");
          if (msg.toLowerCase().includes("already exists") && slugToCheck) {
            await api.put(`/articles/${slugToCheck}/`, payload);
            toast("Your article has been saved!", "success");
            router.push(`/dashboard/editor`);
            return;
          }
          throw err;
        }
        const articleId = response?.data?.id;
        if (articleId) {
          toast("Your article has been saved!", "success");
          router.push(`/dashboard/editor`);
        }
      } catch (err: any) {
        // Robust backend error parsing
        let backendError = "Unknown error";
        const data = err?.response?.data;
        if (data) {
          if (typeof data === "string") {
            backendError = data;
          } else if (typeof data === "object") {
            const src =
              data.error && typeof data.error === "object" ? data.error : data;
            backendError = Object.entries(src)
              .map(([k, v]) =>
                `${k}: ${Array.isArray(v) ? v.map((x) => String(x)).join(", ") : String(v)}`
              )
              .join(" | ");
          }
        } else if (err?.message) {
          backendError = err.message;
        }
        // Fallback dialog based on the assembled human-readable error string
        if (
          !isRetry &&
          backendError &&
          backendError.toLowerCase().includes("already exists")
        ) {
          const clean = String(payload.slug || "");
          const base = clean.replace(/-\d+$/, "");
          let existingId: number | null = null;
          try {
            const ex = await api.get(`/articles/exists/?slug=${clean}`);
            if (ex?.data?.exists) existingId = ex?.data?.id ?? null;
          } catch {}
          console.debug('[SlugConflict] Fallback on 400 unique: opening dialog', {
            slug: clean,
            existingId,
          });
          setSlugConflict({
            isOpen: true,
            currentSlug: clean,
            title: formData.title ?? "",
            baseSlug: base,
            onResolve: async (action: SlugResolveAction) => {
              if (action === "overwrite") {
                setLoading(true);
                try {
                  // Overwrite by slug regardless of whether we have id
                  await api.put(`/articles/${clean}/`, payload);
                  toast("Your article has been saved!", "success");
                  setSlugConflict((prev) => ({ ...prev, isOpen: false }));
                  router.push(`/dashboard/editor`);
                } catch {
                  alert("Failed to overwrite existing article.");
                } finally {
                  setLoading(false);
                }
              } else if (action === "next") {
                const nextSlug = await getNextAvailableSlug(base);
                setFormData((prev: any) => ({ ...prev, slug: nextSlug }));
                await handleSave(true);
              } else {
                setSlugConflict((prev) => ({ ...prev, isOpen: false }));
              }
            },
          });
          return;
        }
        console.error("Error creating article:", backendError);
        setFormData((prev: any) => ({ ...prev, error: backendError }));
      } finally {
        // Always clear loading unless a nested branch already navigated/returned
        setLoading(false);
      }
    },
    [formData, payload, setFormData, setLoading, router, originalSlug, setOriginalSlug]
  );

  /** Save and immediately reset to blank form (Add Another) */
  const handleSaveAndAddAnother = useCallback(async () => {
    // Client-side preflight: enforce summary length <= 300
    const summaryLen = String(formData.summary || "").length;
    if (summaryLen > 300) {
      toast("Summary must be 300 characters or fewer.", "error");
      setFormData((prev: any) => ({
        ...prev,
        error: "summary: Ensure this field has no more than 300 characters.",
      }));
      return;
    }
    setLoading(true);
    try {
  await api.post("/articles/", payload);
  toast("Your article has been saved!", "success");
      setFormData({
        id: "",
        title: "",
        slug: "",
        summary: "",
        content: "",
        featured_image: null,
        featured_image_asset: "",
        category: "POLITICS",
        is_breaking_news: false,
        author: "1",
        co_author: "",
        is_published: false,
        published_date: "",
        scheduled_publish_time: "",
        tags: "",
        meta_description: "",
        view_count: 0,
        created_date: "",
        updated_date: "",
      });
    } catch (err) {
      console.error("Error creating article:", err);
      setFormData((prev: any) => ({
        ...prev,
        error: "Failed to create article.",
      }));
    } finally {
      setLoading(false);
    }
  }, [payload, setFormData, setLoading]);

  /** Save (create or update) and continue editing in place */
  const handleSaveAndContinue = useCallback(async () => {
    // Client-side preflight: enforce summary length <= 300
    const summaryLen = String(formData.summary || "").length;
    if (summaryLen > 300) {
      toast("Summary must be 300 characters or fewer.", "error");
      setFormData((prev: any) => ({
        ...prev,
        error: "summary: Ensure this field has no more than 300 characters.",
      }));
      return;
    }
    setLoading(true);
    try {
      if (formData.id || originalSlug || formData.slug) {
        const slug = String(originalSlug || payload.slug || formData.slug);
        await api.put(`/articles/${slug}/`, payload);
        if (setOriginalSlug) setOriginalSlug(String(payload.slug || ""));
      } else {
        const response = await api.post("/articles/", payload);
        const newId = response?.data?.id ?? "";
        if (newId) setFormData((prev: any) => ({ ...prev, id: newId }));
      }
      toast("Your article has been saved!", "success");
    } catch (err) {
      console.error("Error saving article:", err);
      setFormData((prev: any) => ({
        ...prev,
        error: "Failed to save article.",
      }));
    } finally {
      setLoading(false);
    }
  }, [formData.id, formData.slug, originalSlug, payload, setFormData, setLoading, setOriginalSlug]);

  /** Save and return slug for preview consumers */
  const handleSaveAndGetSlug = useCallback(async () => {
    // Client-side preflight: enforce summary length <= 300
    const summaryLen = String(formData.summary || "").length;
    if (summaryLen > 300) {
      const msg = "summary: Ensure this field has no more than 300 characters.";
      toast("Summary must be 300 characters or fewer.", "error");
      setFormData((prev: any) => ({ ...prev, error: msg }));
      return { slug: null, error: msg };
    }
    setLoading(true);
    try {
      let response;
      if (formData.id || originalSlug || formData.slug) {
        const slug = String(originalSlug || payload.slug || formData.slug);
        response = await api.put(`/articles/${slug}/`, payload);
        if (setOriginalSlug) setOriginalSlug(String(payload.slug || ""));
      } else {
        response = await api.post("/articles/", payload);
        const newId = response?.data?.id ?? "";
        if (newId) setFormData((prev: any) => ({ ...prev, id: newId }));
      }
      toast("Your article has been saved!", "success");
      const returnedSlug =
        response?.data?.slug ?? (formData.slug ? String(formData.slug) : null);
      return { slug: returnedSlug, error: null };
    } catch (error: any) {
      let backendError = "Unknown error";
      const data = error?.response?.data;
      if (data) {
        if (typeof data === "string") {
          backendError = data;
        } else if (typeof data === "object") {
          backendError = Object.entries(data)
            .map(([k, v]) =>
              `${k}: ${Array.isArray(v) ? v.join(", ") : String(v)}`
            )
            .join(" | ");
        }
      } else if (error?.message) {
        backendError = error.message;
      }
      return { slug: null, error: backendError };
    } finally {
      setLoading(false);
    }
  }, [formData.id, formData.slug, originalSlug, payload, setFormData, setLoading, setOriginalSlug]);

  // Ensure onResolve is always callable
  const safeSlugConflict: SlugConflictState = {
    ...slugConflict,
    onResolve:
      typeof slugConflict.onResolve === "function"
        ? slugConflict.onResolve
        : async () => {},
  };

  return {
    handleSave,
    handleSaveAndAddAnother,
    handleSaveAndContinue,
    handleSaveAndGetSlug,
    slugConflict: safeSlugConflict,
  };
}
