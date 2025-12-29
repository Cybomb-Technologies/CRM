import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TaskForm } from "./TaskForm";
import { taskAPI } from "./utils";
import { useAuth } from "@/contexts/AuthContext";
// Import APIs for related records
import { leadsAPI } from "../../sales/leads/leadsAPI";
import contactsAPI from "../../sales/contacts/contactsAPI";
import accountsAPI from "../../sales/accounts/accountsAPI";
import dealsAPI from "../../sales/deals/dealsAPI";

export function CreateTaskDialog({ open, onOpenChange, onTaskCreated }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    status: "pending",
    relatedTo: "", // Store ID or Name? The backend stores { id, name }.
    relatedToType: "deal",
    relatedToId: "", // NEW: Store the ID separately if needed
    assignedTo: user?.name || "You",
  });
  const [loading, setLoading] = useState(false);

  // NEW: State for dynamic options
  const [recordOptions, setRecordOptions] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(false);

  // NEW: Fetch records when relatedToType changes
  useEffect(() => {
    const fetchRelatedRecords = async () => {
      setLoadingRecords(true);
      setRecordOptions([]);
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
          list = response.deals || response.data || response; // Deals are in response.deals
        }

        // Ensure list is an array
        const safeList = Array.isArray(list) ? list : [];

        // Normalize data to { id, name }
        const formattedOptions = safeList.map((item, index) => {
          let name = "Unknown Record";
          if (item.title) name = item.title; // For Deals
          else if (item.name) name = item.name; // For Accounts or virtuals
          else if (item.firstName || item.lastName) name = `${item.firstName || ''} ${item.lastName || ''}`.trim(); // For Leads/Contacts
          else if (item.company) name = item.company; // Fallback

          return {
            id: item._id || item.id || `unknown-${index}`,
            name: name
          };
        });

        // Filter out empty names or unknown records if desired, or keep them to show valid IDs
        setRecordOptions(formattedOptions.filter(opt => opt.name && opt.name !== "Unknown Record"));
      } catch (error) {
        console.error("Failed to fetch related records:", error);
      } finally {
        setLoadingRecords(false);
      }
    };

    if (open) {
      fetchRelatedRecords();
    }
  }, [formData.relatedToType, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Task title is required");
      return;
    }

    if (!formData.dueDate) {
      alert("Due date is required");
      return;
    }

    try {
      setLoading(true);

      const taskData = {
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate,
        priority: formData.priority,
        status: formData.status,
        relatedTo: {
          type: formData.relatedToType,
          id: formData.relatedToId || `temp-${Date.now()}`, // Use real ID if available
          name: formData.relatedTo || "Unnamed",
        },
        assignedTo: formData.assignedTo,
        createdBy: user?.id || "current-user",
      };

      await taskAPI.createTask(taskData);

      // Reset form
      setFormData({
        title: "",
        description: "",
        dueDate: "",
        priority: "medium",
        status: "pending",
        relatedTo: "",
        relatedToType: "deal",
        relatedToId: "",
        assignedTo: user?.name || "You",
      });

      onOpenChange(false);

      if (onTaskCreated) {
        onTaskCreated();
      }
    } catch (error) {
      console.error("Error creating task:", error);
      alert(`Error creating task: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    // If changing the Record Name dropdown, we might want to store both ID and Name
    if (field === "relatedToRecord") {
      // value is expected to be the ID or the full object? 
      // Let's assume the Select returns the ID, and we find the name.
      const selectedRecord = recordOptions.find(r => r.id === value);
      if (selectedRecord) {
        setFormData(prev => ({
          ...prev,
          relatedTo: selectedRecord.name,
          relatedToId: selectedRecord.id
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Add a new task to track your to-do items and deadlines.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <TaskForm
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
              {loading ? "Creating..." : "Create Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
