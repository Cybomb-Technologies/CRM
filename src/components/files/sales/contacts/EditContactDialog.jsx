// src/components/contacts/EditContactDialog.jsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ContactForm from "./ContactForm";

const EditContactDialog = ({
  open,
  onOpenChange,
  onContactUpdated,
  initialData,
}) => {
  const handleSuccess = (updatedContact) => {
    // Ensure we pass the original ID back
    const contactWithId = {
      ...updatedContact,
      id: initialData?.id || initialData?._id,
      _id: initialData?._id || initialData?.id,
    };
    onContactUpdated(contactWithId);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Contact</DialogTitle>
        </DialogHeader>
        <ContactForm
          onSuccess={handleSuccess}
          onCancel={() => onOpenChange(false)}
          initialData={initialData}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditContactDialog;
