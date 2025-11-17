import React from "react";
import { ActivityCard } from "./ActivityCard";
import { mockMeetings } from "./utils";

export function MeetingsView({ filters }) {
  const filteredMeetings = mockMeetings.filter((meeting) => {
    if (
      filters.search &&
      !meeting.title.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }
    if (filters.status !== "all" && meeting.status !== filters.status)
      return false;
    if (filters.priority !== "all" && meeting.priority !== filters.priority)
      return false;
    return true;
  });

  const handleEdit = (meeting) => {
    console.log("Edit meeting:", meeting);
  };

  const handleComplete = (meeting) => {
    console.log("Complete meeting:", meeting);
  };

  const handleDelete = (meeting) => {
    console.log("Delete meeting:", meeting);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold flex items-center">
          <span className="mr-2">📅</span>
          Meetings ({filteredMeetings.length})
        </h3>
      </div>

      {filteredMeetings.length === 0 ? (
        <div className="text-center py-8 border rounded-lg">
          <p className="text-gray-500">No meetings found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMeetings.map((meeting) => (
            <ActivityCard
              key={meeting.id}
              activity={meeting}
              onEdit={handleEdit}
              onComplete={handleComplete}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
