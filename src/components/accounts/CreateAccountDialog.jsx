// src/components/accounts/CreateAccountDialog.jsx
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import AccountForm from './AccountForm';

const CreateAccountDialog = ({ open, onOpenChange, onAccountCreated }) => {
  const handleSuccess = (account) => {
    onAccountCreated(account);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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