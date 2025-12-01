import React, { useState, useEffect } from "react";
import { MeetingCard } from "./MeetingCard";
import { MeetingFilters } from "./MeetingFilters";
import { EditMeetingDialog } from "./EditMeetingDialog";
import { meetingAPI } from "./utils";

export function MeetingsList({ onCreateMeeting, refreshTrigger }) {
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    priority: "all",
  });
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      setError(null);
      const meetingsData = await meetingAPI.getMeetings(filters);
      setMeetings(meetingsData);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching meetings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, [filters, refreshTrigger]);

  const handleEdit = (meeting) => {
    setEditingMeeting(meeting);
    setIsEditDialogOpen(true);
  };

  const handleComplete = async (meeting) => {
    try {
      await meetingAPI.completeMeeting(meeting._id);
      fetchMeetings(); // Refresh the list
    } catch (error) {
      console.error("Error completing meeting:", error);
    }
  };

  const handleDelete = async (meeting) => {
    try {
      if (window.confirm("Are you sure you want to delete this meeting?")) {
        await meetingAPI.deleteMeeting(meeting._id);
        fetchMeetings(); // Refresh the list
      }
    } catch (error) {
      console.error("Error deleting meeting:", error);
    }
  };

  const handleStatusChange = async (meeting, newStatus) => {
    try {
      await meetingAPI.updateMeeting(meeting._id, { status: newStatus });
      fetchMeetings(); // Refresh the list
    } catch (error) {
      console.error("Error updating meeting status:", error);
    }
  };

  const handleMeetingUpdated = () => {
    fetchMeetings(); // Refresh the list
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <p>Error loading meetings: {error}</p>
        <button
          onClick={fetchMeetings}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MeetingFilters filters={filters} onFiltersChange={setFilters} />

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold flex items-center">
            <span className="mr-2">📅</span>
            Meetings ({meetings.length})
          </h3>
        </div>

        {meetings.length === 0 ? (
          <div className="text-center py-8 border rounded-lg">
            <p className="text-gray-500">No meetings found</p>
            {filters.search ||
            filters.status !== "all" ||
            filters.priority !== "all" ? (
              <p className="text-sm text-gray-400 mt-2">
                Try adjusting your filters
              </p>
            ) : (
              <button
                onClick={onCreateMeeting}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Schedule Your First Meeting
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {meetings.map((meeting) => (
              <MeetingCard
                key={meeting._id}
                meeting={meeting}
                onEdit={handleEdit}
                onComplete={handleComplete}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>

      <EditMeetingDialog
        meeting={editingMeeting}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onMeetingUpdated={handleMeetingUpdated}
      />
    </div>
  );
}
