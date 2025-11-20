// Mock data for calls
export const mockCalls = [
  {
    id: 1,
    title: "Follow-up call with John Smith",
    description: "Discuss product demo feedback and address concerns",
    scheduledTime: "2024-01-14T15:30:00",
    status: "completed",
    priority: "medium",
    callType: "outbound",
    relatedTo: { type: "contact", id: "contact-1", name: "John Smith" },
    assignedTo: "You",
    createdBy: "You",
    createdAt: "2024-01-08T14:00:00",
    updatedAt: "2024-01-14T16:00:00",
    duration: 15,
    outcome: "Positive feedback, scheduled follow-up meeting",
    phoneNumber: "+1 (555) 123-4567",
  },
  {
    id: 2,
    title: "Sales consultation call",
    description: "Discuss pricing and implementation timeline",
    scheduledTime: "2024-01-17T11:00:00",
    status: "scheduled",
    priority: "high",
    callType: "inbound",
    relatedTo: { type: "lead", id: "lead-2", name: "Sarah Johnson" },
    assignedTo: "You",
    createdBy: "You",
    createdAt: "2024-01-12T10:00:00",
    updatedAt: "2024-01-12T10:00:00",
    duration: 30,
    outcome: "",
    phoneNumber: "+1 (555) 987-6543",
  },
  {
    id: 3,
    title: "Customer support call",
    description: "Help with technical issue and provide solution",
    scheduledTime: "2024-01-13T09:00:00",
    status: "completed",
    priority: "medium",
    callType: "inbound",
    relatedTo: { type: "account", id: "account-3", name: "Global Solutions" },
    assignedTo: "You",
    createdBy: "Support Team",
    createdAt: "2024-01-12T16:00:00",
    updatedAt: "2024-01-13T09:45:00",
    duration: 45,
    outcome: "Issue resolved, customer satisfied",
    phoneNumber: "+1 (555) 456-7890",
  },
];

// Helper functions
export const getPriorityColor = (priority) => {
  switch (priority) {
    case "high":
      return "destructive";
    case "medium":
      return "default";
    case "low":
      return "secondary";
    default:
      return "default";
  }
};

export const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "scheduled", label: "Scheduled" },
  { value: "completed", label: "Completed" },
  { value: "missed", label: "Missed" },
];

export const priorityOptions = [
  { value: "all", label: "All Priorities" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export const callTypeOptions = [
  { value: "all", label: "All Call Types" },
  { value: "inbound", label: "Inbound" },
  { value: "outbound", label: "Outbound" },
];
