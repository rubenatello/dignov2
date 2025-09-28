import React from "react";
import type { FormDataState } from "./types";

interface PublishingTabProps {
  formData: FormDataState;
  setFormData: React.Dispatch<React.SetStateAction<FormDataState>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSaveAndContinue: () => Promise<void>;
  getNext6amET: () => string;
}

const PublishingTab: React.FC<PublishingTabProps> = ({ formData, setFormData, handleChange, handleSaveAndContinue, getNext6amET }) => (
  <div className="space-y-4">
    <div>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="is_published"
          checked={formData.is_published}
          onChange={handleChange}
        />
        Published
        <button
          type="button"
          className="ml-2 px-3 py-1 rounded bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition"
          onClick={() => {
            const now = new Date();
            const pad = (n: number) => n.toString().padStart(2, "0");
            const local = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
            setFormData((prev) => ({ ...prev, is_published: true, published_date: local }));
          }}
        >
          Now
        </button>
        <button
          type="button"
          className="ml-2 px-3 py-1 rounded bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition border border-blue-700"
          onClick={async () => {
            const formatted = getNext6amET();
            setFormData((prev) => ({ ...prev, scheduled_publish_time: formatted }));
            await handleSaveAndContinue();
          }}
        >
          Publish at 6AM ET
        </button>
      </label>
    </div>
    <div className="flex items-center gap-2">
      <div className="flex-1">
        <label className="block text-sm font-medium mb-1">Published Date</label>
        <input
          type="datetime-local"
          name="published_date"
          value={formData.published_date}
          onChange={handleChange}
          className="w-full border border-gray-200 px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
        />
      </div>
      <button
        type="button"
        className="ml-1 px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 border border-gray-300 text-xs text-gray-700"
        title="Clear published date"
        onClick={() => setFormData((prev) => ({ ...prev, published_date: "" }))}
      >
        Clear
      </button>
    </div>
    <div className="flex items-center gap-2">
      <div className="flex-1">
        <label className="block text-sm font-medium mb-1">Scheduled Publish Time</label>
        <input
          type="datetime-local"
          name="scheduled_publish_time"
          value={formData.scheduled_publish_time}
          onChange={handleChange}
          className="w-full border border-gray-200 px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
        />
      </div>
      <button
        type="button"
        className="ml-1 px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 border border-gray-300 text-xs text-gray-700"
        title="Clear scheduled publish time"
        onClick={() => setFormData((prev) => ({ ...prev, scheduled_publish_time: "" }))}
      >
        Clear
      </button>
    </div>
  </div>
);

export default PublishingTab;
