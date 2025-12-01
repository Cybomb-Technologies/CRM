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

export function CallForm({ formData, onInputChange, currentUser }) {
  return (
    <div className="space-y-4">
      {/* Call Owner Field */}
      <div>
        <Label htmlFor="callOwner">Call Owner</Label>
        <Select
          value={currentUser?.id || ""}
          onValueChange={(value) => {
            onInputChange("assignedTo", currentUser?.name || "You");
          }}
        >
          <SelectTrigger className="w-full">
            <div className="flex items-center justify-between w-full">
              <span>{currentUser?.name || "You"}</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
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
        <Label htmlFor="title">Call Subject *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => onInputChange("title", e.target.value)}
          placeholder="e.g., Follow-up on product demo"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Call Purpose</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onInputChange("description", e.target.value)}
          placeholder="Purpose of the call and key discussion points..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="scheduledTime">Scheduled Time *</Label>
          <Input
            id="scheduledTime"
            type="datetime-local"
            value={formData.scheduledTime}
            onChange={(e) => onInputChange("scheduledTime", e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="duration">Expected Duration (minutes)</Label>
          <Input
            id="duration"
            type="number"
            value={formData.duration}
            onChange={(e) =>
              onInputChange("duration", parseInt(e.target.value) || 30)
            }
            placeholder="30"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="callType">Call Type *</Label>
          <Select
            value={formData.callType}
            onValueChange={(value) => onInputChange("callType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inbound">Inbound</SelectItem>
              <SelectItem value="outbound">Outbound</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            value={formData.phoneNumber}
            onChange={(e) => onInputChange("phoneNumber", e.target.value)}
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
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

        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => onInputChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="missed">Missed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="outcome">Expected Outcome</Label>
        <Textarea
          id="outcome"
          value={formData.outcome}
          onChange={(e) => onInputChange("outcome", e.target.value)}
          placeholder="What do you hope to achieve from this call?"
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="notes">Call Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => onInputChange("notes", e.target.value)}
          placeholder="Additional notes about the call..."
          rows={2}
        />
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
