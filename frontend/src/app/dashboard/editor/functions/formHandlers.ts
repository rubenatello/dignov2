import { ChangeEvent } from "react";

/**
 * Handles input, textarea, and select changes for a generic form state object.
 * Supports text, checkbox, and file inputs.
 */
export function handleFormChange<T extends Record<string, any>>(
  setFormData: (updater: (prev: T) => T) => void
) {
  return (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, type } = target;

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: (target as HTMLInputElement).checked }));
      return;
    }
    if (type === "file") {
      const files = (target as HTMLInputElement).files;
      const file = files && files.length > 0 ? files[0] : null;
      setFormData((prev) => ({ ...prev, [name]: file }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: target.value }));
  };
}
