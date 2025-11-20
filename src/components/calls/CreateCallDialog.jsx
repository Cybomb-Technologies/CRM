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

export function CreateCallDialog({ open, onOpenChange }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    scheduledTime: "",
    priority: "medium",
    status: "scheduled",
    relatedTo: "",
    relatedToType: "deal",
    duration: "",
    callType: "outbound",
    phoneNumber: "",
    outcome: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Creating call:", formData);
    onOpenChange(false);
    // Reset form
    setFormData({
      title: "",
      description: "",
      scheduledTime: "",
      priority: "medium",
      status: "scheduled",
      relatedTo: "",
      relatedToType: "deal",
      duration: "",
      callType: "outbound",
      phoneNumber: "",
      outcome: "",
    });
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
          <CallForm formData={formData} onInputChange={handleInputChange} />

          <div className="flex justify-end space-x-2 pt-6 mt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Schedule Call</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
