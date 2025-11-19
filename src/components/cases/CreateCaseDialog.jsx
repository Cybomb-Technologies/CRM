import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CaseForm } from "./CaseForm";

export function CreateCaseDialog({ open, onOpenChange }) {
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    productName: "",
    status: "New",
    type: "-None-",
    priority: "-None-",
    caseOrigin: "-None-",
    caseReason: "-None-",
    relatedTo: "",
    relatedToType: "account",
    accountName: "",
    reportedBy: "",
    dealName: "",
    email: "",
    phone: "",
    internalComments: "",
    solution: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Creating case:", formData);
    onOpenChange(false);
    // Reset form
    setFormData({
      subject: "",
      description: "",
      productName: "",
      status: "New",
      type: "-None-",
      priority: "-None-",
      caseOrigin: "-None-",
      caseReason: "-None-",
      relatedTo: "",
      relatedToType: "account",
      accountName: "",
      reportedBy: "",
      dealName: "",
      email: "",
      phone: "",
      internalComments: "",
      solution: "",
    });
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Case</DialogTitle>
          <DialogDescription>
            Record customer feedback and support issues with products or
            services.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <CaseForm formData={formData} onInputChange={handleInputChange} />

          <div className="flex justify-end space-x-2 pt-6 mt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="button" variant="outline">
              Save and New
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
