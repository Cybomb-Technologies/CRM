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

export function EditTaskDialog({ task, open, onOpenChange, onTaskUpdated }) {
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

  useEffect(() => {
    if (task && open) {
      // Format date for datetime-local input
      const dueDate = new Date(task.dueDate);
      const formattedDate = dueDate.toISOString().slice(0, 16);

      setFormData({
        title: task.title || "",
        description: task.description || "",
        dueDate: formattedDate,
        priority: task.priority || "medium",
        status: task.status || "pending",
        relatedTo: task.relatedTo?.name || "",
        relatedToType: task.relatedTo?.type || "deal",
        assignedTo: task.assignedTo || user?.name || "You",
      });
    }
  }, [task, open, user]);

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
          id: task.relatedTo?.id || `temp-${Date.now()}`,
          name: formData.relatedTo || "Unnamed",
        },
        assignedTo: formData.assignedTo,
      };

      await taskAPI.updateTask(task._id, taskData);

      onOpenChange(false);

      if (onTaskUpdated) {
        onTaskUpdated();
      }
    } catch (error) {
      console.error("Error updating task:", error);
      alert(`Error updating task: ${error.message}`);
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
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Update the task details and save changes.
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
              {loading ? "Updating..." : "Update Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
