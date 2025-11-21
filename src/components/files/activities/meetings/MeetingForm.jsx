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
import { Checkbox } from "@/components/ui/checkbox";

export function MeetingForm({ formData, onInputChange }) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Meeting Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => onInputChange("title", e.target.value)}
          placeholder="e.g., Quarterly Business Review"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Agenda</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onInputChange("description", e.target.value)}
          placeholder="Meeting agenda and topics to discuss..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startTime">Start Time</Label>
          <Input
            id="startTime"
            type="datetime-local"
            value={formData.startTime}
            onChange={(e) => onInputChange("startTime", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="endTime">End Time</Label>
          <Input
            id="endTime"
            type="datetime-local"
            value={formData.endTime}
            onChange={(e) => onInputChange("endTime", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => onInputChange("location", e.target.value)}
            placeholder="Meeting room or online link"
          />
        </div>

        <div>
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input
            id="duration"
            type="number"
            value={formData.duration}
            onChange={(e) => onInputChange("duration", e.target.value)}
            placeholder="60"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="attendees">Attendees</Label>
        <Input
          id="attendees"
          value={formData.attendees}
          onChange={(e) => onInputChange("attendees", e.target.value)}
          placeholder="Enter email addresses separated by commas"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isOnline"
          checked={formData.isOnline}
          onCheckedChange={(checked) => onInputChange("isOnline", checked)}
        />
        <Label htmlFor="isOnline">This is an online meeting</Label>
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
