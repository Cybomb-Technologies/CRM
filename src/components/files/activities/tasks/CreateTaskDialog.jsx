//CreateTaskDialog.jsx
import React, { useState } from "react";
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

export function CreateTaskDialog({ open, onOpenChange, onTaskCreated }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    status: "pending",
    relatedTo: "",
    relatedToType: "deal",
    assignedTo: user?.name || "You",
  });
  const [loading, setLoading] = useState(false);

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
          id: `temp-${Date.now()}`,
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
    setFormData((prev) => ({ ...prev, [field]: value }));
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
