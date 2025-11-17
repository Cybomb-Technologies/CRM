// Mock data for each activity type
export const mockTasks = [
  {
    id: 1,
    type: "task",
    title: "Prepare proposal for ABC Corp",
    description:
      "Create sales proposal and pricing details for the upcoming deal",
    dueDate: "2024-01-15T14:00:00",
    status: "pending",
    priority: "high",
    relatedTo: { type: "deal", id: "deal-1", name: "ABC Corp Deal" },
    assignedTo: "You",
    createdBy: "John Doe",
    createdAt: "2024-01-10T09:00:00",
    updatedAt: "2024-01-10T09:00:00",
  },
  {
    id: 2,
    type: "task",
    title: "Send contract to XYZ Ltd",
    description: "Prepare and send service agreement",
    dueDate: "2024-01-16T16:00:00",
    status: "in-progress",
    priority: "medium",
    relatedTo: { type: "account", id: "account-1", name: "XYZ Ltd" },
    assignedTo: "You",
    createdBy: "Jane Smith",
    createdAt: "2024-01-11T10:00:00",
    updatedAt: "2024-01-11T10:00:00",
  },
];

export const mockMeetings = [
  {
    id: 3,
    type: "meeting",
    title: "Quarterly Review with XYZ Ltd",
    description:
      "Discuss Q1 performance and future roadmap with key stakeholders",
    startTime: "2024-01-16T10:00:00",
    endTime: "2024-01-16T11:00:00",
    status: "scheduled",
    priority: "medium",
    relatedTo: { type: "account", id: "account-1", name: "XYZ Ltd" },
    assignedTo: "You",
    createdBy: "Jane Smith",
    createdAt: "2024-01-09T11:00:00",
    updatedAt: "2024-01-09T11:00:00",
    attendees: ["john@xyz.com", "jane@xyz.com", "mike@xyz.com"],
    location: "Conference Room A",
    duration: 60,
    isOnline: false,
  },
];

export const mockCalls = [
  {
    id: 4,
    type: "call",
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
];

// Helper functions
export const getTypeIcon = (type) => {
  switch (type) {
    case "task":
      return "✅";
    case "meeting":
      return "📅";
    case "call":
      return "📞";
    default:
      return "📝";
  }
};

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
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export const priorityOptions = [
  { value: "all", label: "All Priorities" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export const typeOptions = [
  { value: "all", label: "All Types" },
  { value: "task", label: "Tasks" },
  { value: "meeting", label: "Meetings" },
  { value: "call", label: "Calls" },
];

export const callTypeOptions = [
  { value: "all", label: "All Call Types" },
  { value: "inbound", label: "Inbound" },
  { value: "outbound", label: "Outbound" },
];
