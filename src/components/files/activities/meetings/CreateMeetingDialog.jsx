import React, { useState } from "react";
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

export function CreateMeetingDialog({ open, onOpenChange, onMeetingCreated }) {
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
          id: `temp-${Date.now()}`,
          name: formData.relatedTo || "Unnamed",
        },
        hostName: formData.hostName, // Changed from assignedTo to hostName
        createdBy: user?.id || "current-user",
      };

      await meetingAPI.createMeeting(meetingData);

      // Reset form
      setFormData({
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

      onOpenChange(false);

      if (onMeetingCreated) {
        onMeetingCreated();
      }
    } catch (error) {
      console.error("Error creating meeting:", error);
      alert(`Error creating meeting: ${error.message}`);
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
          <DialogTitle>Schedule New Meeting</DialogTitle>
          <DialogDescription>
            Schedule a new meeting with clients or team members.
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
              {loading ? "Scheduling..." : "Schedule Meeting"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
