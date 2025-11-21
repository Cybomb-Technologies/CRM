// src/components/accounts/EditAccountDialog.jsx
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import AccountForm from './AccountForm';

const EditAccountDialog = ({ open, onOpenChange, onAccountUpdated, initialData }) => {
  const handleSuccess = (updatedAccount) => {
    onAccountUpdated(updatedAccount);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Account</DialogTitle>
        </DialogHeader>
        <AccountForm 
          onSuccess={handleSuccess}
          onCancel={() => onOpenChange(false)}
          initialData={initialData}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditAccountDialog;