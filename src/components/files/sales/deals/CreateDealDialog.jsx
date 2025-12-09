// src/components/deals/CreateDealDialog.jsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import DealForm from "./DealForm";
import { useAuth } from "@/contexts/AuthContext"; // Add this import

const CreateDealDialog = ({ open, onOpenChange, onDealCreated }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth(); // Get current user from auth context

  // Reset when dialog closes
  useEffect(() => {
    if (!open) {
      setIsSubmitting(false);
    }
  }, [open]);

  const handleSuccess = (result) => {
    console.log("🎯 CreateDealDialog: Form submission result:", result);

    if (result.success) {
      // Close the dialog
      setIsSubmitting(true);

      // FIXED: Call onDealCreated to notify parent to refresh
      if (onDealCreated && typeof onDealCreated === "function") {
        onDealCreated(result.deal);
      }

      // Close after a short delay
      setTimeout(() => {
        onOpenChange(false);
        setIsSubmitting(false);
      }, 300);
    } else {
      // Error occurred, don't close dialog
      console.error("Deal creation failed:", result.error);
    }
  };

  const handleCancel = () => {
    if (!isSubmitting) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
        onPointerDownOutside={(e) => {
          if (isSubmitting) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Create New Deal</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new deal.
          </DialogDescription>
        </DialogHeader>
        <DealForm
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          currentUser={user} // Pass current user to DealForm
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateDealDialog;
