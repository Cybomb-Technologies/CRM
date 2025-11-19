// Mock data for solutions
export const mockSolutions = [
  {
    id: 1,
    solutionNumber: "SOL-001",
    solutionTitle: "How to reset password in mobile app",
    status: "Published",
    productName: "Mobile App v2.0",
    question: "How can I reset my password if I forget it?",
    answer:
      "To reset your password: 1. Go to the login screen 2. Click 'Forgot Password' 3. Enter your email 4. Check your email for reset link 5. Create new password",
    owner: "You",
    createdDate: "2024-01-15T09:00:00",
    updatedDate: "2024-01-15T09:00:00",
    relatedCases: ["CASE-001", "CASE-005"],
    views: 156,
    helpful: 23,
  },
  {
    id: 2,
    solutionNumber: "SOL-002",
    solutionTitle: "Enabling dark mode in web dashboard",
    status: "Draft",
    productName: "Web Dashboard",
    question: "How to enable dark mode in the web dashboard?",
    answer:
      "Dark mode is currently in development and will be available in the next release. Expected release date: February 15, 2024.",
    owner: "Support Team",
    createdDate: "2024-01-14T14:30:00",
    updatedDate: "2024-01-15T10:15:00",
    relatedCases: ["CASE-002"],
    views: 45,
    helpful: 8,
  },
  {
    id: 3,
    solutionNumber: "SOL-003",
    solutionTitle: "Troubleshooting payment gateway issues",
    status: "Published",
    productName: "Payment System",
    question: "Why are my payments failing?",
    answer:
      "Common payment failures can be due to: 1. Insufficient funds 2. Incorrect card details 3. Browser cache issues 4. Network connectivity. Try clearing cache and retry with correct details.",
    owner: "Payment Team",
    createdDate: "2024-01-10T11:20:00",
    updatedDate: "2024-01-12T16:45:00",
    relatedCases: ["CASE-003", "CASE-007", "CASE-012"],
    views: 289,
    helpful: 67,
  },
];

// Helper functions
export const getStatusColor = (status) => {
  switch (status) {
    case "Published":
      return "bg-green-100 text-green-800";
    case "Draft":
      return "bg-yellow-100 text-yellow-800";
    case "Review":
      return "bg-blue-100 text-blue-800";
    case "Archived":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "Published", label: "Published" },
  { value: "Draft", label: "Draft" },
  { value: "Review", label: "Under Review" },
  { value: "Archived", label: "Archived" },
];

export const productOptions = [
  { value: "all", label: "All Products" },
  { value: "Mobile App v2.0", label: "Mobile App v2.0" },
  { value: "Web Dashboard", label: "Web Dashboard" },
  { value: "Payment System", label: "Payment System" },
  { value: "CRM Platform", label: "CRM Platform" },
];
