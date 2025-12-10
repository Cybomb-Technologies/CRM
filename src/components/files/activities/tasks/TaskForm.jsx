import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown } from "lucide-react";

export function TaskForm({ formData, onInputChange, currentUser }) {
  return (
    <div className="space-y-4">
      {/* Task Owner Field */}
      <div>
        <Label htmlFor="taskOwner">Task Owner</Label>
        <Select
          value={currentUser?.id || ""}
          onValueChange={(value) => {
            // For now, only current user is available
            // This sets up for future multi-user support
            onInputChange("assignedTo", currentUser?.name || "You");
          }}
        >
          <SelectTrigger className="w-full">
            <div className="flex items-center justify-between w-full">
              <span>{currentUser?.name || "You"}</span>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={currentUser?.id || "current-user"}>
              <div className="flex flex-col">
                <span className="font-medium">
                  {currentUser?.name || "You"}
                </span>
                <span className="text-sm text-gray-500">
                  {currentUser?.email || ""}
                </span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-500 mt-1">
          Currently assigned to: {currentUser?.name} ({currentUser?.email})
        </p>
      </div>

      <div>
        <Label htmlFor="title">Task Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => onInputChange("title", e.target.value)}
          placeholder="e.g., Prepare sales proposal"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onInputChange("description", e.target.value)}
          placeholder="Describe the task in detail..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            type="datetime-local"
            value={formData.dueDate}
            onChange={(e) => onInputChange("dueDate", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select
            value={formData.priority}
            onValueChange={(value) => onInputChange("priority", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="relatedToType">Related To</Label>
          <Select
            value={formData.relatedToType}
            onValueChange={(value) => onInputChange("relatedToType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lead">Lead</SelectItem>
              <SelectItem value="contact">Contact</SelectItem>
              <SelectItem value="account">Account</SelectItem>
              <SelectItem value="deal">Deal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="relatedTo">Record Name</Label>
          <Input
            id="relatedTo"
            value={formData.relatedTo}
            onChange={(e) => onInputChange("relatedTo", e.target.value)}
            placeholder="Search records..."
          />
        </div>
      </div>
    </div>
  );
}
