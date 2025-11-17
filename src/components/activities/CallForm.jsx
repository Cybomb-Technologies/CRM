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

export function CallForm({ formData, onInputChange }) {
  return (
    <div className="space-y-4">
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
          <Label htmlFor="scheduledTime">Scheduled Time</Label>
          <Input
            id="scheduledTime"
            type="datetime-local"
            value={formData.scheduledTime}
            onChange={(e) => onInputChange("scheduledTime", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="duration">Expected Duration (minutes)</Label>
          <Input
            id="duration"
            type="number"
            value={formData.duration}
            onChange={(e) => onInputChange("duration", e.target.value)}
            placeholder="30"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="callType">Call Type</Label>
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
