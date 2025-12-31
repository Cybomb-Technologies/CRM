// Mock data removed - fetching from backend
export const mockCases = [];

// Helper functions
export const getStatusColor = (status) => {
  switch (status) {
    case "New":
      return "bg-blue-100 text-blue-800";
    case "In Progress":
      return "bg-yellow-100 text-yellow-800";
    case "Waiting on Customer":
      return "bg-orange-100 text-orange-800";
    case "Resolved":
      return "bg-green-100 text-green-800";
    case "Closed":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getPriorityColor = (priority) => {
  switch (priority) {
    case "High":
      return "destructive";
    case "Medium":
      return "default";
    case "Low":
      return "secondary";
    default:
      return "default";
  }
};

export const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "New", label: "New" },
  { value: "In Progress", label: "In Progress" },
  { value: "Waiting on Customer", label: "Waiting on Customer" },
  { value: "Resolved", label: "Resolved" },
  { value: "Closed", label: "Closed" },
];

export const priorityOptions = [
  { value: "all", label: "All Priorities" },
  { value: "High", label: "High" },
  { value: "Medium", label: "Medium" },
  { value: "Low", label: "Low" },
];

export const typeOptions = [
  { value: "all", label: "All Types" },
  { value: "Problem", label: "Problem" },
  { value: "Feature Request", label: "Feature Request" },
  { value: "Question", label: "Question" },
];

export const caseOriginOptions = [
  { value: "all", label: "All Origins" },
  { value: "Email", label: "Email" },
  { value: "Phone", label: "Phone" },
  { value: "Web", label: "Web" },
  { value: "Social Media", label: "Social Media" },
];
