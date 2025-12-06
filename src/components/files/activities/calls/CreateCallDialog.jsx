import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CallForm } from "./CallForm";
import { callAPI } from "./utils";
import { useAuth } from "@/contexts/AuthContext";

export function CreateCallDialog({ open, onOpenChange, onCallCreated }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    scheduledTime: "",
    duration: 30,
    priority: "medium",
    status: "scheduled",
    callType: "outbound",
    phoneNumber: "",
    outcome: "",
    notes: "",
    relatedTo: "",
    relatedToType: "deal",
    assignedTo: user?.name || "You",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Call title is required");
      return;
    }

    if (!formData.scheduledTime) {
      alert("Scheduled time is required");
      return;
    }

    try {
      setLoading(true);

      const callData = {
        title: formData.title,
        description: formData.description,
        scheduledTime: formData.scheduledTime,
        duration: formData.duration,
        priority: formData.priority,
        status: formData.status,
        callType: formData.callType,
        phoneNumber: formData.phoneNumber,
        outcome: formData.outcome,
        notes: formData.notes,
        relatedTo: {
          type: formData.relatedToType,
          id: `temp-${Date.now()}`,
          name: formData.relatedTo || "Unnamed",
        },
        assignedTo: formData.assignedTo,
        createdBy: user?.id || "current-user",
      };

      await callAPI.createCall(callData);

      // Reset form
      setFormData({
        title: "",
        description: "",
        scheduledTime: "",
        duration: 30,
        priority: "medium",
        status: "scheduled",
        callType: "outbound",
        phoneNumber: "",
        outcome: "",
        notes: "",
        relatedTo: "",
        relatedToType: "deal",
        assignedTo: user?.name || "You",
      });

      onOpenChange(false);

      if (onCallCreated) {
        onCallCreated();
      }
    } catch (error) {
      console.error("Error creating call:", error);
      alert(`Error creating call: ${error.message}`);
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
          <DialogTitle>Schedule New Call</DialogTitle>
          <DialogDescription>
            Schedule a new phone call with clients or contacts.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <CallForm
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
              {loading ? "Scheduling..." : "Schedule Call"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
