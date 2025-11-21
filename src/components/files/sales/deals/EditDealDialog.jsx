import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import DealForm from './DealForm';

const EditDealDialog = ({ open, onOpenChange, onDealUpdated, initialData }) => {
  const handleSuccess = (updatedDeal) => {
    onDealUpdated(updatedDeal);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Deal</DialogTitle>
        </DialogHeader>
        <DealForm 
          onSuccess={handleSuccess}
          onCancel={() => onOpenChange(false)}
          initialData={initialData}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditDealDialog;