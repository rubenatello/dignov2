import { useCallback } from "react";
import axios from "axios";

export function useArticleSave(formData, setFormData, setLoading, router) {
  // Save new article
  const handleSave = useCallback(async () => {
    setLoading(true);
    try {
      const payload = {
        ...formData,
        tags: typeof formData.tags === 'string'
          ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : Array.isArray(formData.tags) ? formData.tags : [],
      };
      const response = await axios.post("/api/articles/", payload);
      const articleId = response.data?.id;
      if (articleId) {
        router.push(`/dashboard/editor/${articleId}`);
      }
    } catch (error) {
      console.error("Error creating article:", error);
    } finally {
      setLoading(false);
    }
  }, [formData, router, setLoading]);

  // Save and add another
  const handleSaveAndAddAnother = useCallback(async () => {
    setLoading(true);
    try {
      const payload = {
        ...formData,
        tags: typeof formData.tags === 'string'
          ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : Array.isArray(formData.tags) ? formData.tags : [],
      };
      await axios.post("/api/articles/", payload);
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
    } catch (error) {
      console.error("Error creating article:", error);
    } finally {
      setLoading(false);
    }
  }, [formData, setFormData, setLoading]);

  // Save and continue editing
  const handleSaveAndContinue = useCallback(async () => {
    setLoading(true);
    try {
      let response;
      const payload = {
        ...formData,
        tags: typeof formData.tags === 'string'
          ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : Array.isArray(formData.tags) ? formData.tags : [],
      };
      if (formData.id) {
        response = await axios.put(`/api/articles/${formData.id}/`, payload);
      } else {
        response = await axios.post("/api/articles/", payload);
        const newId = response?.data?.id ?? "";
        if (newId) setFormData((prev) => ({ ...prev, id: newId }));
      }
    } catch (error) {
      console.error("Error saving article:", error);
    } finally {
      setLoading(false);
    }
  }, [formData, setFormData, setLoading]);

  return { handleSave, handleSaveAndAddAnother, handleSaveAndContinue };
}
