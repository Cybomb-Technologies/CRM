// src/components/files/sales/campaigns/campaignsAPI.js
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

// Campaign API functions
export const campaignsAPI = {
  // Get all campaigns with filters
  getCampaigns: async (filters = {}) => {
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
    const url = `/campaigns${queryString ? `?${queryString}` : ""}`;

    return apiRequest(url);
  },

  // Get single campaign
  getCampaign: async (id) => {
    return apiRequest(`/campaigns/${id}`);
  },

  // Create new campaign
  createCampaign: async (campaignData) => {
    return apiRequest("/campaigns", {
      method: "POST",
      body: JSON.stringify(campaignData),
    });
  },

  // Update campaign
  updateCampaign: async (id, campaignData) => {
    return apiRequest(`/campaigns/${id}`, {
      method: "PUT",
      body: JSON.stringify(campaignData),
    });
  },

  // Delete campaign (archive)
  deleteCampaign: async (id) => {
    return apiRequest(`/campaigns/${id}`, {
      method: "DELETE",
    });
  },

  // Permanent delete campaign
  permanentDeleteCampaign: async (id) => {
    return apiRequest(`/campaigns/${id}/permanent`, {
      method: "DELETE",
    });
  },

  // Campaign members operations
  addMembersToCampaign: async (campaignId, members) => {
    return apiRequest(`/campaigns/${campaignId}/members`, {
      method: "POST",
      body: JSON.stringify({ members }),
    });
  },

  removeMembersFromCampaign: async (campaignId, memberIds) => {
    return apiRequest(`/campaigns/${campaignId}/members/remove`, {
      method: "PUT",
      body: JSON.stringify({ memberIds }),
    });
  },

  updateMemberStatus: async (campaignId, memberId, status, value) => {
    return apiRequest(`/campaigns/${campaignId}/members/${memberId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status, value }),
    });
  },

  // Campaign activities operations
  getCampaignActivities: async (campaignId, filters = {}) => {
    const queryParams = new URLSearchParams();

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
    const url = `/campaigns/${campaignId}/activities${
      queryString ? `?${queryString}` : ""
    }`;

    return apiRequest(url);
  },

  addActivityToCampaign: async (campaignId, activityData) => {
    return apiRequest(`/campaigns/${campaignId}/activities`, {
      method: "POST",
      body: JSON.stringify(activityData),
    });
  },

  updateActivityInCampaign: async (campaignId, activityId, activityData) => {
    return apiRequest(`/campaigns/${campaignId}/activities/${activityId}`, {
      method: "PUT",
      body: JSON.stringify(activityData),
    });
  },

  deleteActivityFromCampaign: async (campaignId, activityId) => {
    return apiRequest(`/campaigns/${campaignId}/activities/${activityId}`, {
      method: "DELETE",
    });
  },

  // Campaign analytics
  getCampaignAnalytics: async (campaignId) => {
    return apiRequest(`/campaigns/${campaignId}/analytics`);
  },

  // Bulk operations
  bulkUpdateCampaigns: async (campaignIds, updates) => {
    return apiRequest("/campaigns/bulk-update", {
      method: "POST",
      body: JSON.stringify({ campaignIds, updates }),
    });
  },

  bulkDeleteCampaigns: async (campaignIds) => {
    return apiRequest("/campaigns/bulk-delete", {
      method: "POST",
      body: JSON.stringify({ campaignIds }),
    });
  },

  bulkAddMembersToCampaigns: async (campaignIds, members) => {
    return apiRequest("/campaigns/bulk-add-members", {
      method: "POST",
      body: JSON.stringify({ campaignIds, members }),
    });
  },
};
