import React from "react";
import type { FormDataState } from "./types";

interface StatisticsTabProps {
  formData: FormDataState;
}

const StatisticsTab: React.FC<StatisticsTabProps> = ({ formData }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium mb-1">View Count</label>
      <input
        type="number"
        value={formData.view_count}
        readOnly
        className="w-full border border-gray-200 px-4 py-3 rounded-lg bg-gray-100"
      />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Created Date</label>
      <input
        type="text"
        value={formData.created_date}
        readOnly
        className="w-full border border-gray-200 px-4 py-3 rounded-lg bg-gray-100"
      />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Updated Date</label>
      <input
        type="text"
        value={formData.updated_date}
        readOnly
        className="w-full border border-gray-200 px-4 py-3 rounded-lg bg-gray-100"
      />
    </div>
  </div>
);

export default StatisticsTab;
