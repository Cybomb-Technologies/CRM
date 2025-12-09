// src/components/deals/EditDealDialog.jsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import DealForm from "./DealForm";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import dealsAPI from "./dealsAPI";

const EditDealDialog = ({ open, onOpenChange, onDealUpdated, initialData }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [dealData, setDealData] = useState(null);

  // Fetch deal data when dialog opens with initialData
  useEffect(() => {
    const fetchDealData = async () => {
      if (open && initialData?.id) {
        setLoading(true);
        try {
          const response = await dealsAPI.getDealById(initialData.id);
          if (response.success) {
            setDealData(response.deal);
          } else {
            toast({
              title: "Error",
              description: "Failed to fetch deal details",
              variant: "destructive",
            });
            onOpenChange(false);
          }
        } catch (error) {
          console.error("Error fetching deal:", error);
          toast({
            title: "Error",
            description: "Failed to fetch deal details",
            variant: "destructive",
          });
          onOpenChange(false);
        } finally {
          setLoading(false);
        }
      } else if (open && initialData) {
        // If initialData is already provided, use it directly
        setDealData(initialData);
      }
    };

    fetchDealData();
  }, [open, initialData, onOpenChange, toast]);

  const handleSuccess = (result) => {
    if (result.success) {
      if (onDealUpdated) {
        onDealUpdated(result.deal);
      }
      toast({
        title: "Deal Updated",
        description: "Deal has been updated successfully.",
      });
      onOpenChange(false);
    } else {
      toast({
        title: "Update Failed",
        description: result.error || "Failed to update deal",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setDealData(null);
    onOpenChange(false);
  };

  // Show loading while fetching deal data
  if (loading) {
    return (
      <Dialog open={open} onOpenChange={handleCancel}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Deal</DialogTitle>
            <DialogDescription>Loading deal details...</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Deal</DialogTitle>
          <DialogDescription>
            Update the deal information below.
          </DialogDescription>
        </DialogHeader>
        {dealData ? (
          <DealForm
            onSuccess={handleSuccess}
            onCancel={handleCancel}
            initialData={dealData}
            currentUser={user}
          />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No deal data available</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditDealDialog;
