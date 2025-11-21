// Mock data for meetings
export const mockMeetings = [
  {
    id: 1,
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
  {
    id: 2,
    title: "Product Demo for New Client",
    description: "Demonstrate new features to potential enterprise client",
    startTime: "2024-01-18T14:00:00",
    endTime: "2024-01-18T15:00:00",
    status: "scheduled",
    priority: "high",
    relatedTo: { type: "lead", id: "lead-1", name: "Tech Innovations Inc" },
    assignedTo: "You",
    createdBy: "You",
    createdAt: "2024-01-10T09:00:00",
    updatedAt: "2024-01-10T09:00:00",
    attendees: ["ceo@techinnovations.com", "cto@techinnovations.com"],
    location: "Online - Zoom",
    duration: 60,
    isOnline: true,
  },
  {
    id: 3,
    title: "Team Standup Meeting",
    description: "Daily team synchronization and progress update",
    startTime: "2024-01-11T09:00:00",
    endTime: "2024-01-11T09:30:00",
    status: "completed",
    priority: "low",
    relatedTo: { type: "account", id: "account-2", name: "Internal" },
    assignedTo: "You",
    createdBy: "Team Lead",
    createdAt: "2024-01-10T16:00:00",
    updatedAt: "2024-01-11T09:30:00",
    attendees: ["team@company.com"],
    location: "Team Room B",
    duration: 30,
    isOnline: false,
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
