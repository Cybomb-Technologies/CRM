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

export function CreateMeetingDialog({ open, onOpenChange }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    priority: "medium",
    status: "scheduled",
    relatedTo: "",
    relatedToType: "deal",
    attendees: "",
    location: "",
    duration: "",
    isOnline: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Creating meeting:", formData);
    onOpenChange(false);
    // Reset form
    setFormData({
      title: "",
      description: "",
      startTime: "",
      endTime: "",
      priority: "medium",
      status: "scheduled",
      relatedTo: "",
      relatedToType: "deal",
      attendees: "",
      location: "",
      duration: "",
      isOnline: false,
    });
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
          <MeetingForm formData={formData} onInputChange={handleInputChange} />

          <div className="flex justify-end space-x-2 pt-6 mt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Schedule Meeting</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
