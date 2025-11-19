import React, { useState } from "react";
import { ActivityCard } from "../shared/ActivityCard";
import { ActivityFilters } from "../shared/ActivityFilters";
import { mockCalls } from "../shared/utils";

export function CallsView({ onCreateActivity }) {
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    priority: "all",
    callType: "all",
  });

  const filteredCalls = mockCalls.filter((call) => {
    if (
      filters.search &&
      !call.title.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }
    if (filters.status !== "all" && call.status !== filters.status)
      return false;
    if (filters.priority !== "all" && call.priority !== filters.priority)
      return false;
    if (filters.callType !== "all" && call.callType !== filters.callType)
      return false;
    return true;
  });

  const handleEdit = (call) => {
    console.log("Edit call:", call);
  };

  const handleComplete = (call) => {
    console.log("Complete call:", call);
  };

  const handleDelete = (call) => {
    console.log("Delete call:", call);
  };

  return (
    <div className="space-y-6">
      <ActivityFilters
        filters={filters}
        onFiltersChange={setFilters}
        type="calls"
      />

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold flex items-center">
            <span className="mr-2">📞</span>
            Calls ({filteredCalls.length})
          </h3>
        </div>

        {filteredCalls.length === 0 ? (
          <div className="text-center py-8 border rounded-lg">
            <p className="text-gray-500">No calls found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCalls.map((call) => (
              <ActivityCard
                key={call.id}
                activity={call}
                onEdit={handleEdit}
                onComplete={handleComplete}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
