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

export function CreateSolutionDialog({ open, onOpenChange, solutionToEdit = null }) {
  const [formData, setFormData] = useState({
    solutionTitle: "",
    status: "Draft",
    productName: "",
    question: "",
    answer: "",
    relatedCases: "",
  });

  React.useEffect(() => {
    if (solutionToEdit) {
      setFormData({
        solutionTitle: solutionToEdit.solutionTitle || "",
        status: solutionToEdit.status || "Draft",
        productName: solutionToEdit.productName || "",
        question: solutionToEdit.question || "",
        answer: solutionToEdit.answer || "",
        relatedCases: solutionToEdit.relatedCases ? solutionToEdit.relatedCases.join(", ") : "",
      });
    } else {
        setFormData({
            solutionTitle: "",
            status: "Draft",
            productName: "",
            question: "",
            answer: "",
            relatedCases: "",
          });
    }
  }, [solutionToEdit, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (solutionToEdit) {
        console.log("Updating solution:", { ...solutionToEdit, ...formData });
        // Call update API here
    } else {
        console.log("Creating solution:", formData);
        // Call create API here
    }
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
          <DialogTitle>{solutionToEdit ? "Edit Solution" : "Create New Solution"}</DialogTitle>
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
