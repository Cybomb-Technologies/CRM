// src/components/files/sales/leads/EditLeadDialog.jsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import LeadForm from "./LeadForm";

const EditLeadDialog = ({ open, onOpenChange, onLeadUpdated, initialData }) => {
  const handleSuccess = (updatedLead) => {
    onLeadUpdated(updatedLead);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Lead</DialogTitle>
          <DialogDescription>
            Update the lead information below.
          </DialogDescription>
        </DialogHeader>
        <LeadForm
          onSuccess={handleSuccess}
          onCancel={() => onOpenChange(false)}
          initialData={initialData}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditLeadDialog;
