const API_URL = import.meta.env.VITE_API_URL;

// Helper function for API calls
const apiRequest = async (endpoint, options = {}) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

// Helper function for file uploads
const apiRequestWithFile = async (endpoint, formData, method = "POST") => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: method,
      body: formData,
      // Don't set Content-Type header for FormData, browser will set it automatically with boundary
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

// Lead CRUD Operations
export const leadsAPI = {
  // Get all leads with filters
  getLeads: async (filters = {}) => {
    const queryParams = new URLSearchParams();

    // Add all filter parameters
    Object.keys(filters).forEach((key) => {
      if (
        filters[key] !== undefined &&
        filters[key] !== null &&
        filters[key] !== ""
      ) {
        queryParams.append(key, filters[key]);
      }
    });

    const queryString = queryParams.toString();
    const url = `/leads${queryString ? `?${queryString}` : ""}`;

    return apiRequest(url);
  },

  // Get single lead
  getLead: async (id) => {
    return apiRequest(`/leads/${id}`);
  },

  // Create new lead with file upload support
  createLead: async (leadData) => {
    // Check if there's an image file to upload
    if (leadData.image && leadData.image instanceof File) {
      const formData = new FormData();

      // Append all lead data as JSON string
      const { image, ...leadDataWithoutImage } = leadData;
      formData.append("data", JSON.stringify(leadDataWithoutImage));

      // Append the image file
      formData.append("image", image);

      return apiRequestWithFile("/leads", formData, "POST");
    } else {
      // Regular JSON request without file
      return apiRequest("/leads", {
        method: "POST",
        body: JSON.stringify(leadData),
      });
    }
  },

  // Update lead with file upload support
  updateLead: async (id, leadData) => {
    // Check if there's an image file to upload or remove
    if (leadData.image instanceof File || leadData.removeImage) {
      const formData = new FormData();

      // Append all lead data as JSON string
      const { image, ...leadDataWithoutImage } = leadData;
      formData.append("data", JSON.stringify(leadDataWithoutImage));

      // Append the image file if it exists
      if (leadData.image instanceof File) {
        formData.append("image", leadData.image);
      }

      return apiRequestWithFile(`/leads/${id}`, formData, "PUT");
    } else {
      // Regular JSON request without file
      return apiRequest(`/leads/${id}`, {
        method: "PUT",
        body: JSON.stringify(leadData),
      });
    }
  },

  // Delete lead
  deleteLead: async (id) => {
    return apiRequest(`/leads/${id}`, {
      method: "DELETE",
    });
  },

  // Bulk operations
  bulkUpdateLeads: async (leadIds, updates) => {
    return apiRequest("/leads/bulk-update", {
      method: "POST",
      body: JSON.stringify({ leadIds, updates }),
    });
  },

  bulkDeleteLeads: async (leadIds) => {
    return apiRequest("/leads/bulk-delete", {
      method: "POST",
      body: JSON.stringify({ leadIds }),
    });
  },

  // Lead conversion - FIXED: Calls proper endpoint
  convertLead: async (leadId, dealData = {}) => {
    return apiRequest(`/leads/${leadId}/convert`, {
      method: "POST",
      body: JSON.stringify(dealData),
    });
  },

  bulkConvertLeads: async (leadIds) => {
    return apiRequest("/leads/bulk-convert", {
      method: "POST",
      body: JSON.stringify({ leadIds }),
    });
  },

  // Sync lead to contact - FIXED: Calls proper endpoint
  syncLeadToContact: async (leadId) => {
    return apiRequest(`/leads/${leadId}/sync-contact`, {
      method: "POST",
    });
  },

  // Approve leads
  approveLeads: async (leadIds) => {
    return apiRequest("/leads/approve", {
      method: "POST",
      body: JSON.stringify({ leadIds }),
    });
  },

  // Manage tags
  manageLeadTags: async (leadIds, tagsToAdd = [], tagsToRemove = []) => {
    return apiRequest("/leads/manage-tags", {
      method: "POST",
      body: JSON.stringify({ leadIds, tagsToAdd, tagsToRemove }),
    });
  },

  // Deduplicate leads
  deduplicateLeads: async (criteria = ["email", "phone"]) => {
    return apiRequest("/leads/deduplicate", {
      method: "POST",
      body: JSON.stringify({ criteria }),
    });
  },

  // Add to campaign
  addLeadsToCampaign: async (leadIds, campaignId) => {
    return apiRequest("/leads/add-to-campaign", {
      method: "POST",
      body: JSON.stringify({ leadIds, campaignId }),
    });
  },
};
