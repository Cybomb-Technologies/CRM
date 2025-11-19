import React, { useState } from "react";
import { ActivityCard } from "../shared/ActivityCard";
import { ActivityFilters } from "../shared/ActivityFilters";
import { mockTasks } from "../shared/utils";

export function TasksView({ onCreateActivity }) {
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    priority: "all",
  });

  const filteredTasks = mockTasks.filter((task) => {
    if (
      filters.search &&
      !task.title.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }
    if (filters.status !== "all" && task.status !== filters.status)
      return false;
    if (filters.priority !== "all" && task.priority !== filters.priority)
      return false;
    return true;
  });

  const handleEdit = (task) => {
    console.log("Edit task:", task);
  };

  const handleComplete = (task) => {
    console.log("Complete task:", task);
  };

  const handleDelete = (task) => {
    console.log("Delete task:", task);
  };

  return (
    <div className="space-y-6">
      <ActivityFilters
        filters={filters}
        onFiltersChange={setFilters}
        type="tasks"
      />

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold flex items-center">
            <span className="mr-2">✅</span>
            Tasks ({filteredTasks.length})
          </h3>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="text-center py-8 border rounded-lg">
            <p className="text-gray-500">No tasks found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <ActivityCard
                key={task.id}
                activity={task}
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
