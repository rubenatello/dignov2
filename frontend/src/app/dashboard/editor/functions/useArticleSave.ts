import { useCallback } from "react";
import axios from "axios";

export function useArticleSave(formData, setFormData, setLoading, router) {
  // Save new article
  const handleSave = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/articles/", formData);
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
      await axios.post("/api/articles/", formData);
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
      if (formData.id) {
        response = await axios.put(`/api/articles/${formData.id}/`, formData);
      } else {
        response = await axios.post("/api/articles/", formData);
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
