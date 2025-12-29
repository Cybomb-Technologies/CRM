import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MeetingForm } from "./MeetingForm";
import { meetingAPI } from "./utils";
import { useAuth } from "@/contexts/AuthContext";

// Import APIs
import { leadsAPI } from "../../sales/leads/leadsAPI";
import contactsAPI from "../../sales/contacts/contactsAPI";
import accountsAPI from "../../sales/accounts/accountsAPI";
import dealsAPI from "../../sales/deals/dealsAPI";

export function CreateMeetingDialog({ open, onOpenChange, onMeetingCreated }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    location: "",
    duration: 60,
    priority: "medium",
    status: "scheduled",
    venueType: "in-office", // New field
    meetingLink: "",
    attendees: [],
    relatedTo: "",
    relatedToId: "", // Added to store ID
    relatedToType: "deal",
    hostName: user?.name || "You", // Changed from assignedTo to hostName
  });
  const [loading, setLoading] = useState(false);
  const [recordOptions, setRecordOptions] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(false);

  // Fetch records
  useEffect(() => {
    const fetchRecords = async () => {
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
      alert("Meeting title is required");
      return;
    }

    if (!formData.startTime || !formData.endTime) {
      alert("Start time and end time are required");
      return;
    }

    try {
      setLoading(true);

      const meetingData = {
        title: formData.title,
        description: formData.description,
        startTime: formData.startTime,
        endTime: formData.endTime,
        location: formData.location,
        duration: formData.duration,
        priority: formData.priority,
        status: formData.status,
        venueType: formData.venueType, // New field
        meetingLink: formData.meetingLink,
        attendees: formData.attendees,
        relatedTo: {
          type: formData.relatedToType,
          id: formData.relatedToId || `temp-${Date.now()}`,
          name: formData.relatedTo || "Unnamed",
        },
        hostName: formData.hostName, // Changed from assignedTo to hostName
        createdBy: user?.id || "current-user",
      };

      await meetingAPI.createMeeting(meetingData);

      // Reset form
      setFormData({
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        location: "",
        duration: 60,
        priority: "medium",
        status: "scheduled",
        venueType: "in-office", // New field
        meetingLink: "",
        attendees: [],
        relatedTo: "",
        relatedToId: "",
        relatedToType: "deal",
        hostName: user?.name || "You", // Changed from assignedTo to hostName
      });

      onOpenChange(false);

      if (onMeetingCreated) {
        onMeetingCreated();
      }
    } catch (error) {
      console.error("Error creating meeting:", error);
      alert(`Error creating meeting: ${error.message}`);
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
          <DialogTitle>Schedule New Meeting</DialogTitle>
          <DialogDescription>
            Schedule a new meeting with clients or team members.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <MeetingForm
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
              {loading ? "Scheduling..." : "Schedule Meeting"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
