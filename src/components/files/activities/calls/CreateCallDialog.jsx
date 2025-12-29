import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CallForm } from "./CallForm";
import { callAPI } from "./utils";
import { useAuth } from "@/contexts/AuthContext";

// Import APIs
import { leadsAPI } from "../../sales/leads/leadsAPI";
import contactsAPI from "../../sales/contacts/contactsAPI";
import accountsAPI from "../../sales/accounts/accountsAPI";
import dealsAPI from "../../sales/deals/dealsAPI";

export function CreateCallDialog({ open, onOpenChange, onCallCreated }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    scheduledTime: "",
    duration: 30,
    priority: "medium",
    status: "scheduled",
    callType: "outbound",
    phoneNumber: "",
    outcome: "",
    notes: "",
    relatedTo: "",
    relatedToId: "", // Added to store ID
    relatedToType: "lead", // Default to lead
    assignedTo: user?.name || "You",
  });
  const [loading, setLoading] = useState(false);
  const [recordOptions, setRecordOptions] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(false);

  // Fetch related records when type changes
  useEffect(() => {
    const fetchRecords = async () => {
      setLoadingRecords(true);
      setRecordOptions([]); // Clear existing options
      try {
        let list = [];
        if (formData.relatedToType === "lead") {
          const response = await leadsAPI.getLeads();
          list = response.data || response;
        } else if (formData.relatedToType === "contact") {
          const response = await contactsAPI.getContacts();
          list = response.contacts || response.data || response;
        } else if (formData.relatedToType === "account") {
          const response = await accountsAPI.fetchAccounts();
          list = response.data || response.accounts || response;
        } else if (formData.relatedToType === "deal") {
          const response = await dealsAPI.getDeals();
          list = response.deals || response.data || response;
        }

        const safeList = Array.isArray(list) ? list : [];

        const formattedOptions = safeList.map((item, index) => {
          let name = "Unknown Record";
          if (formData.relatedToType === 'deal' && item.title) name = item.title;
          else if (formData.relatedToType === 'account' && item.name) name = item.name;
          else if (item.firstName || item.lastName) name = `${item.firstName || ''} ${item.lastName || ''}`.trim();
          else if (item.name) name = item.name;
          else if (item.company) name = item.company;

          return {
            id: item._id || item.id || `unknown-${index}`,
            name: name || "Unknown Record"
          };
        });

        setRecordOptions(formattedOptions);
      } catch (error) {
        console.error(`Error fetching ${formData.relatedToType}s:`, error);
        setRecordOptions([]);
      } finally {
        setLoadingRecords(false);
      }
    };

    if (open) {
      fetchRecords();
    }
  }, [formData.relatedToType, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Call title is required");
      return;
    }

    if (!formData.scheduledTime) {
      alert("Scheduled time is required");
      return;
    }

    try {
      setLoading(true);

      const callData = {
        title: formData.title,
        description: formData.description,
        scheduledTime: formData.scheduledTime,
        duration: formData.duration,
        priority: formData.priority,
        status: formData.status,
        callType: formData.callType,
        phoneNumber: formData.phoneNumber,
        outcome: formData.outcome,
        notes: formData.notes,
        relatedTo: {
          type: formData.relatedToType,
          id: formData.relatedToId || `temp-${Date.now()}`,
          name: formData.relatedTo || "Unnamed",
        },
        assignedTo: formData.assignedTo,
        createdBy: user?.id || "current-user",
      };

      await callAPI.createCall(callData);

      // Reset form
      setFormData({
        title: "",
        description: "",
        scheduledTime: "",
        duration: 30,
        priority: "medium",
        status: "scheduled",
        callType: "outbound",
        phoneNumber: "",
        outcome: "",
        notes: "",
        relatedTo: "",
        relatedToId: "",
        relatedToType: "lead",
        assignedTo: user?.name || "You",
      });

      onOpenChange(false);

      if (onCallCreated) {
        onCallCreated();
      }
    } catch (error) {
      console.error("Error creating call:", error);
      alert(`Error creating call: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field === "relatedToId") {
      // Also update the name when ID changes
      const selectedOption = recordOptions.find(opt => opt.id === value);
      setFormData(prev => ({
        ...prev,
        relatedToId: value,
        relatedTo: selectedOption ? selectedOption.name : ""
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule New Call</DialogTitle>
          <DialogDescription>
            Schedule a new phone call with clients or contacts.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <CallForm
            formData={formData}
            onInputChange={handleInputChange}
            currentUser={user}
            recordOptions={recordOptions}
            loadingRecords={loadingRecords}
          />

          <div className="flex justify-end space-x-2 pt-6 mt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Scheduling..." : "Schedule Call"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
