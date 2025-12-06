import React, { useState, useEffect } from "react";
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

export function EditCallDialog({ call, open, onOpenChange, onCallUpdated }) {
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

  useEffect(() => {
    if (call && open) {
      // Format date for datetime-local input
      const scheduledTime = new Date(call.scheduledTime);
      const formattedTime = scheduledTime.toISOString().slice(0, 16);

      setFormData({
        title: call.title || "",
        description: call.description || "",
        scheduledTime: formattedTime,
        duration: call.duration || 30,
        priority: call.priority || "medium",
        status: call.status || "scheduled",
        callType: call.callType || "outbound",
        phoneNumber: call.phoneNumber || "",
        outcome: call.outcome || "",
        notes: call.notes || "",
        relatedTo: call.relatedTo?.name || "",
        relatedToType: call.relatedTo?.type || "deal",
        assignedTo: call.assignedTo || user?.name || "You",
      });
    }
  }, [call, open, user]);

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
          id: call.relatedTo?.id || `temp-${Date.now()}`,
          name: formData.relatedTo || "Unnamed",
        },
        assignedTo: formData.assignedTo,
      };

      await callAPI.updateCall(call._id, callData);

      onOpenChange(false);

      if (onCallUpdated) {
        onCallUpdated();
      }
    } catch (error) {
      console.error("Error updating call:", error);
      alert(`Error updating call: ${error.message}`);
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
          <DialogTitle>Edit Call</DialogTitle>
          <DialogDescription>
            Update the call details and save changes.
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
              {loading ? "Updating..." : "Update Call"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
