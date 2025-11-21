import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SolutionForm } from "./SolutionForm";

export function CreateSolutionDialog({ open, onOpenChange }) {
  const [formData, setFormData] = useState({
    solutionTitle: "",
    status: "Draft",
    productName: "",
    question: "",
    answer: "",
    relatedCases: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Creating solution:", formData);
    onOpenChange(false);
    // Reset form
    setFormData({
      solutionTitle: "",
      status: "Draft",
      productName: "",
      question: "",
      answer: "",
      relatedCases: "",
    });
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Solution</DialogTitle>
          <DialogDescription>
            Provide solutions to help solve recurrent problems encountered by
            customers.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <SolutionForm formData={formData} onInputChange={handleInputChange} />

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
