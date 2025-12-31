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
import { casesService } from "./casesService";
import { useAuth } from "@/contexts/AuthContext";

export function CreateCaseDialog({
  open,
  onOpenChange,
  onSuccess,
  caseToEdit = null,
}) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    caseOwner: user?.name || "You",
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

  React.useEffect(() => {
    if (caseToEdit) {
      setFormData({
        caseOwner: caseToEdit.caseOwner || user?.name || "You",
        subject: caseToEdit.subject || "",
        description: caseToEdit.description || "",
        productName: caseToEdit.productName || "",
        status: caseToEdit.status || "New",
        type: caseToEdit.type || "-None-",
        priority: caseToEdit.priority || "-None-",
        caseOrigin: caseToEdit.caseOrigin || "-None-",
        caseReason: caseToEdit.caseReason || "-None-",
        relatedTo: caseToEdit.relatedTo || "",
        relatedToType: caseToEdit.relatedToType || "account",
        accountName: caseToEdit.accountName || "",
        reportedBy: caseToEdit.reportedBy || "",
        dealName: caseToEdit.dealName || "",
        email: caseToEdit.email || "",
        phone: caseToEdit.phone || "",
        internalComments: caseToEdit.internalComments || "",
        solution: caseToEdit.solution || "",
      });
    } else {
      setFormData({
        caseOwner: user?.name || "You",
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
    }
  }, [caseToEdit, open, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    console.log(
      caseToEdit ? "Updating case:" : "Creating case:",
      formData
    );

    try {
      let response;
      if (caseToEdit) {
        response = await casesService.updateCase(caseToEdit._id, formData);
      } else {
        response = await casesService.createCase(formData);
      }

      if (response.success) {
        if (!caseToEdit) {
          // Reset form only on create
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
        }

        onOpenChange(false);
        if (onSuccess) onSuccess();
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(caseToEdit ? "Failed to update case" : "Failed to create case");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {caseToEdit ? "Edit Case" : "Create New Case"}
          </DialogTitle>
          <DialogDescription>
            {caseToEdit
              ? "Update case details below."
              : "Record customer feedback and support issues with products or services."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <CaseForm formData={formData} onInputChange={handleInputChange} currentUser={user} />

          {error && <div className="text-red-500 mt-2 text-sm">{error}</div>}

          <div className="flex justify-end space-x-2 pt-6 mt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            {!caseToEdit && (
              <Button type="button" variant="outline" disabled={loading}>
                Save and New
              </Button>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
