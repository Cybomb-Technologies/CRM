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
import { ChevronDown } from "lucide-react";

export function MeetingForm({ formData, onInputChange, currentUser, recordOptions = [], loadingRecords = false }) {
  const handleAttendeesChange = (value) => {
    const attendeesArray = value
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email);
    const attendees = attendeesArray.map((email) => ({
      email,
      name: email,
      status: "pending",
    }));
    onInputChange("attendees", attendees);
  };

  const getAttendeesString = () => {
    return formData.attendees.map((attendee) => attendee.email).join(", ");
  };

  return (
    <div className="space-y-4">
      {/* Host Name Field - Changed from Meeting Owner */}
      <div>
        <Label htmlFor="hostName">Host Name</Label>
        <Select
          value={currentUser?.id || ""}
          onValueChange={(value) => {
            onInputChange("hostName", currentUser?.name || "You");
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
          <Label htmlFor="startTime">Start Time *</Label>
          <Input
            id="startTime"
            type="datetime-local"
            value={formData.startTime}
            onChange={(e) => onInputChange("startTime", e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="endTime">End Time *</Label>
          <Input
            id="endTime"
            type="datetime-local"
            value={formData.endTime}
            onChange={(e) => onInputChange("endTime", e.target.value)}
            required
          />
        </div>
      </div>

      {/* Meeting Venue Field - New Addition */}
      <div>
        <Label htmlFor="venueType">Meeting Venue</Label>
        <Select
          value={formData.venueType}
          onValueChange={(value) => onInputChange("venueType", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select venue type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="in-office">In-office</SelectItem>
            <SelectItem value="client-location">Client location</SelectItem>
            <SelectItem value="online">Online</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Conditional Meeting Link Field */}
      {formData.venueType === "online" && (
        <div>
          <Label htmlFor="meetingLink">Meeting Link *</Label>
          <Input
            id="meetingLink"
            value={formData.meetingLink}
            onChange={(e) => onInputChange("meetingLink", e.target.value)}
            placeholder="https://meet.google.com/abc-def-ghi"
            required={formData.venueType === "online"}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="location">Location Details</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => onInputChange("location", e.target.value)}
            placeholder={
              formData.venueType === "in-office"
                ? "e.g., Conference Room A"
                : formData.venueType === "client-location"
                  ? "e.g., Client Office Address"
                  : "Meeting platform details"
            }
          />
        </div>

        <div>
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input
            id="duration"
            type="number"
            value={formData.duration}
            onChange={(e) =>
              onInputChange("duration", parseInt(e.target.value) || 60)
            }
            placeholder="60"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="attendees">Attendees</Label>
        <Input
          id="attendees"
          value={getAttendeesString()}
          onChange={(e) => handleAttendeesChange(e.target.value)}
          placeholder="Enter email addresses separated by commas"
        />
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
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
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
          <Select
            value={formData.relatedToId}
            onValueChange={(value) => onInputChange("relatedToId", value)}
            disabled={loadingRecords}
          >
            <SelectTrigger>
              <SelectValue placeholder={loadingRecords ? "Loading..." : "Select Record"} />
            </SelectTrigger>
            <SelectContent>
              {recordOptions.length > 0 ? (
                recordOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.name}
                  </SelectItem>
                ))
              ) : (
                <div className="p-2 text-sm text-center text-gray-500">
                  {loadingRecords ? "Loading..." : "No records found"}
                </div>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
