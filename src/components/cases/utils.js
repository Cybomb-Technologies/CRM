// Mock data for cases
export const mockCases = [
  {
    id: 1,
    caseNumber: "CASE-001",
    subject: "Login issue with mobile app",
    description:
      "Customer cannot login to mobile application, getting authentication error",
    productName: "Mobile App v2.0",
    status: "New",
    type: "Problem",
    priority: "High",
    caseOrigin: "Email",
    caseReason: "New Problem",
    relatedTo: { type: "account", id: "account-1", name: "TechCorp Inc" },
    owner: "You",
    accountName: "TechCorp Inc",
    reportedBy: "John Smith",
    dealName: "Enterprise Support",
    email: "john.smith@techcorp.com",
    phone: "+1 (555) 123-4567",
    createdDate: "2024-01-15T09:00:00",
    updatedDate: "2024-01-15T09:00:00",
    internalComments:
      "Customer reported issue this morning, needs urgent attention",
  },
  {
    id: 2,
    caseNumber: "CASE-002",
    subject: "Feature request: Dark mode",
    description:
      "Customer requested dark mode feature for better user experience",
    productName: "Web Dashboard",
    status: "In Progress",
    type: "Feature Request",
    priority: "Medium",
    caseOrigin: "Web",
    caseReason: "Complex Functionality",
    relatedTo: { type: "contact", id: "contact-1", name: "Sarah Johnson" },
    owner: "Support Team",
    accountName: "Innovate Solutions",
    reportedBy: "Sarah Johnson",
    dealName: "",
    email: "sarah.j@innovate.com",
    phone: "+1 (555) 987-6543",
    createdDate: "2024-01-14T14:30:00",
    updatedDate: "2024-01-15T10:15:00",
    internalComments: "Feature under development, ETA 2 weeks",
  },
];

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
