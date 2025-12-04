import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AccountForm from "./AccountForm";

const CreateAccountDialog = ({ open, onOpenChange, onAccountCreated }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSuccess = (account) => {
    if (!isProcessing) {
      setIsProcessing(true);
      onAccountCreated(account);

      // Close dialog after successful creation
      setTimeout(() => {
        onOpenChange(false);
        setIsProcessing(false);
      }, 1000);
    }
  };

  const handleOpenChange = (newOpenState) => {
    if (!isProcessing) {
      onOpenChange(newOpenState);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Account</DialogTitle>
        </DialogHeader>
        <AccountForm
          onSuccess={handleSuccess}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateAccountDialog;
