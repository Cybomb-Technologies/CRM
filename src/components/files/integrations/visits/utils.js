// Mock data and utility functions for Visits integration

export const visitStatuses = {
  SCHEDULED: "scheduled",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  OVERDUE: "overdue",
};

export const visitTypes = {
  DEMO: "demo",
  MEETING: "meeting",
  SUPPORT: "support",
  FOLLOW_UP: "followup",
  REVIEW: "review",
};

export const priorityLevels = {
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
};

export const mockVisits = [
  {
    id: 1,
    account: "TechCorp Inc",
    contact: "John Smith",
    purpose: "Product Demo",
    scheduledDate: "2024-01-15",
    scheduledTime: "10:00",
    location: "123 Business Ave, City",
    status: visitStatuses.SCHEDULED,
    type: visitTypes.DEMO,
    priority: priorityLevels.HIGH,
    duration: 60,
    notes: "Discuss enterprise features and pricing",
    relatedDeal: "DEAL-001",
  },
  {
    id: 2,
    account: "Startup Solutions",
    contact: "Sarah Johnson",
    purpose: "Contract Review",
    scheduledDate: "2024-01-15",
    scheduledTime: "14:30",
    location: "456 Innovation St, City",
    status: visitStatuses.IN_PROGRESS,
    type: visitTypes.MEETING,
    priority: priorityLevels.MEDIUM,
    duration: 45,
    notes: "Review contract terms and discuss implementation",
    relatedDeal: "DEAL-002",
  },
];

export const getStatusColor = (status) => {
  const colors = {
    [visitStatuses.SCHEDULED]: "bg-yellow-100 text-yellow-800",
    [visitStatuses.IN_PROGRESS]: "bg-blue-100 text-blue-800",
    [visitStatuses.COMPLETED]: "bg-green-100 text-green-800",
    [visitStatuses.CANCELLED]: "bg-gray-100 text-gray-800",
    [visitStatuses.OVERDUE]: "bg-red-100 text-red-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

export const getPriorityColor = (priority) => {
  const colors = {
    [priorityLevels.HIGH]: "bg-red-100 text-red-800",
    [priorityLevels.MEDIUM]: "bg-yellow-100 text-yellow-800",
    [priorityLevels.LOW]: "bg-green-100 text-green-800",
  };
  return colors[priority] || "bg-gray-100 text-gray-800";
};

export const calculateVisitMetrics = (visits) => {
  const total = visits.length;
  const completed = visits.filter(
    (v) => v.status === visitStatuses.COMPLETED
  ).length;
  const inProgress = visits.filter(
    (v) => v.status === visitStatuses.IN_PROGRESS
  ).length;
  const scheduled = visits.filter(
    (v) => v.status === visitStatuses.SCHEDULED
  ).length;
  const overdue = visits.filter(
    (v) => v.status === visitStatuses.OVERDUE
  ).length;

  return {
    total,
    completed,
    inProgress,
    scheduled,
    overdue,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
};

export const formatVisitTime = (date, time) => {
  const dateTime = new Date(`${date}T${time}`);
  return dateTime.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Calculate route optimization
export const optimizeRoute = (visits) => {
  // This would integrate with actual mapping service API
  console.log("Optimizing route for visits:", visits);
  return {
    totalDistance: "18.5 km",
    estimatedTime: "45 min",
    optimizedOrder: visits.map((v) => v.id),
  };
};
