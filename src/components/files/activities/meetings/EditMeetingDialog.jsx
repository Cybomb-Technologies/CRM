import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MeetingForm } from "./MeetingForm";
import { meetingAPI } from "./utils";
import { useAuth } from "@/contexts/AuthContext";

export function EditMeetingDialog({
  meeting,
  open,
  onOpenChange,
  onMeetingUpdated,
}) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    location: "",
    duration: 60,
    priority: "medium",
    status: "scheduled",
    venueType: "in-office", // New field
    meetingLink: "",
    attendees: [],
    relatedTo: "",
    relatedToType: "deal",
    hostName: user?.name || "You", // Changed from assignedTo to hostName
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (meeting && open) {
      // Format dates for datetime-local input
      const startTime = new Date(meeting.startTime);
      const endTime = new Date(meeting.endTime);

      const formattedStartTime = startTime.toISOString().slice(0, 16);
      const formattedEndTime = endTime.toISOString().slice(0, 16);

      setFormData({
        title: meeting.title || "",
        description: meeting.description || "",
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        location: meeting.location || "",
        duration: meeting.duration || 60,
        priority: meeting.priority || "medium",
        status: meeting.status || "scheduled",
        venueType: meeting.venueType || "in-office", // New field
        meetingLink: meeting.meetingLink || "",
        attendees: meeting.attendees || [],
        relatedTo: meeting.relatedTo?.name || "",
        relatedToType: meeting.relatedTo?.type || "deal",
        hostName: meeting.hostName || user?.name || "You", // Changed from assignedTo to hostName
      });
    }
  }, [meeting, open, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Meeting title is required");
      return;
    }

    if (!formData.startTime || !formData.endTime) {
      alert("Start time and end time are required");
      return;
    }

    try {
      setLoading(true);

      const meetingData = {
        title: formData.title,
        description: formData.description,
        startTime: formData.startTime,
        endTime: formData.endTime,
        location: formData.location,
        duration: formData.duration,
        priority: formData.priority,
        status: formData.status,
        venueType: formData.venueType, // New field
        meetingLink: formData.meetingLink,
        attendees: formData.attendees,
        relatedTo: {
          type: formData.relatedToType,
          id: meeting.relatedTo?.id || `temp-${Date.now()}`,
          name: formData.relatedTo || "Unnamed",
        },
        hostName: formData.hostName, // Changed from assignedTo to hostName
      };

      await meetingAPI.updateMeeting(meeting._id, meetingData);

      onOpenChange(false);

      if (onMeetingUpdated) {
        onMeetingUpdated();
      }
    } catch (error) {
      console.error("Error updating meeting:", error);
      alert(`Error updating meeting: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Meeting</DialogTitle>
          <DialogDescription>
            Update the meeting details and save changes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <MeetingForm
            formData={formData}
            onInputChange={handleInputChange}
            currentUser={user}
          />

          <div className="flex justify-end space-x-2 pt-6 mt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Meeting"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
