const API_URL = import.meta.env.VITE_API_URL;

// API service functions
export const callAPI = {
  getCalls: async (filters = {}) => {
    const queryParams = new URLSearchParams();

    if (filters.search) queryParams.append("search", filters.search);
    if (filters.status && filters.status !== "all")
      queryParams.append("status", filters.status);
    if (filters.priority && filters.priority !== "all")
      queryParams.append("priority", filters.priority);
    if (filters.callType && filters.callType !== "all")
      queryParams.append("callType", filters.callType);

    const response = await fetch(`${API_URL}/calls?${queryParams}`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    return data.data;
  },

  createCall: async (callData) => {
    const response = await fetch(`${API_URL}/calls`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(callData),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    return data.data;
  },

  updateCall: async (callId, callData) => {
    const response = await fetch(`${API_URL}/calls/${callId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(callData),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    return data.data;
  },

  deleteCall: async (callId) => {
    const response = await fetch(`${API_URL}/calls/${callId}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    return data;
  },

  completeCall: async (callId) => {
    const response = await fetch(`${API_URL}/calls/${callId}/complete`, {
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
    case "scheduled":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "missed":
      return "bg-red-100 text-red-800 border-red-200";
    case "cancelled":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "scheduled", label: "Scheduled" },
  { value: "completed", label: "Completed" },
  { value: "missed", label: "Missed" },
  { value: "cancelled", label: "Cancelled" },
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

export const getStatusIcon = (status) => {
  switch (status) {
    case "completed":
      return "✅";
    case "scheduled":
      return "📅";
    case "missed":
      return "❌";
    case "cancelled":
      return "🚫";
    default:
      return "📞";
  }
};

export const getCallTypeIcon = (callType) => {
  return callType === "inbound" ? "📥" : "📤";
};
