const API_URL = import.meta.env.VITE_API_URL;

// API service functions
export const meetingAPI = {
  getMeetings: async (filters = {}) => {
    const queryParams = new URLSearchParams();

    if (filters.search) queryParams.append("search", filters.search);
    if (filters.status && filters.status !== "all")
      queryParams.append("status", filters.status);
    if (filters.priority && filters.priority !== "all")
      queryParams.append("priority", filters.priority);

    const response = await fetch(`${API_URL}/meetings?${queryParams}`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    return data.data;
  },

  createMeeting: async (meetingData) => {
    const response = await fetch(`${API_URL}/meetings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(meetingData),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    return data.data;
  },

  updateMeeting: async (meetingId, meetingData) => {
    const response = await fetch(`${API_URL}/meetings/${meetingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(meetingData),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    return data.data;
  },

  deleteMeeting: async (meetingId) => {
    const response = await fetch(`${API_URL}/meetings/${meetingId}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    return data;
  },

  completeMeeting: async (meetingId) => {
    const response = await fetch(`${API_URL}/meetings/${meetingId}/complete`, {
      method: "PATCH",
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    return data.data;
  },
};

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

export const getStatusColor = (status) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 border-green-200";
    case "in-progress":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "scheduled":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
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

export const getStatusIcon = (status) => {
  switch (status) {
    case "completed":
      return "✅";
    case "in-progress":
      return "🔄";
    case "scheduled":
      return "📅";
    case "cancelled":
      return "❌";
    default:
      return "📝";
  }
};
