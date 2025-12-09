// src/components/deals/dealsAPI.js
const API_URL = import.meta.env.VITE_API_URL;

// Helper function for API calls
const apiRequest = async (endpoint, options = {}) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  };

  // Handle params for GET requests
  if (options.params && (options.method === "GET" || !options.method)) {
    const queryParams = new URLSearchParams();
    Object.keys(options.params).forEach((key) => {
      if (
        options.params[key] !== undefined &&
        options.params[key] !== null &&
        options.params[key] !== ""
      ) {
        queryParams.append(key, options.params[key]);
      }
    });

    const queryString = queryParams.toString();
    endpoint = queryString ? `${endpoint}?${queryString}` : endpoint;

    // Remove params from config as they're now in URL
    delete config.params;
  }

  // Add auth token if available
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Handle body for non-GET requests
  if (config.body && typeof config.body === "object") {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);

    if (!response.ok) {
      // Handle 401 unauthorized
      if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }

      const errorData = await response.json().catch(() => ({}));
      const error = new Error(
        errorData.message || `API error: ${response.status}`
      );
      error.response = errorData;
      error.status = response.status;
      throw error;
    }

    return await response.json();
  } catch (error) {
    console.error("API request failed:", {
      endpoint,
      message: error.message,
      response: error.response,
      status: error.status,
    });
    throw error;
  }
};

const dealsAPI = {
  // Get all deals with optional filters (for table view)
  getDeals: async (params = {}) => {
    // Clean up params - remove undefined, null, or empty string values
    const cleanParams = {};
    Object.keys(params).forEach((key) => {
      if (
        params[key] !== undefined &&
        params[key] !== null &&
        params[key] !== ""
      ) {
        cleanParams[key] = params[key];
      }
    });

    console.log("📤 API Request - getDeals with params:", cleanParams);

    return apiRequest("/deals", { params: cleanParams });
  },

  // Get all deals without pagination (for kanban view)
  getAllDeals: async () => {
    return apiRequest("/deals/all");
  },

  // Get single deal by ID
  getDealById: async (id) => {
    return apiRequest(`/deals/${id}`);
  },

  // Create new deal
  createDeal: async (dealData) => {
    return apiRequest("/deals", {
      method: "POST",
      body: dealData,
    });
  },

  // Update deal
  updateDeal: async (id, dealData) => {
    // Clean the data
    const cleanData = { ...dealData };

    // Convert numbers
    if (cleanData.value !== undefined) {
      cleanData.value = parseFloat(cleanData.value) || 0;
    }

    if (cleanData.probability !== undefined) {
      cleanData.probability = parseInt(cleanData.probability) || 0;
    }

    return apiRequest(`/deals/${id}`, {
      method: "PUT",
      body: cleanData,
    });
  },

  // Delete deal
  deleteDeal: async (id) => {
    return apiRequest(`/deals/${id}`, {
      method: "DELETE",
    });
  },

  // Bulk update deals
  bulkUpdateDeals: async (dealIds, updates) => {
    return apiRequest("/deals/bulk/update", {
      method: "PUT",
      body: { dealIds, updates },
    });
  },

  // Bulk delete deals
  bulkDeleteDeals: async (dealIds) => {
    return apiRequest("/deals/bulk/delete", {
      method: "DELETE",
      body: { dealIds },
    });
  },

  // Move deal to new stage
  moveDealStage: async (dealId, newStage) => {
    return apiRequest(`/deals/${dealId}/move-stage`, {
      method: "PUT",
      body: { newStage },
    });
  },

  // Bulk move deals to new stage
  bulkMoveDealsStage: async (dealIds, newStage) => {
    return apiRequest("/deals/bulk/move-stage", {
      method: "PUT",
      body: { dealIds, newStage },
    });
  },

  // Get deal stages configuration
  getDealStages: async () => {
    return {
      qualification: "Qualification",
      "needs-analysis": "Needs Analysis",
      "value-proposition": "Value Proposition",
      "identify-decision-makers": "Identify Decision Makers",
      "proposal-price-quote": "Proposal/Price Quote",
      "negotiation-review": "Negotiation/Review",
      "closed-won": "Closed Won",
      "closed-lost": "Closed Lost",
      "closed-lost-to-competition": "Closed Lost to Competition",
    };
  },

  // Export deals
  exportDeals: async (dealIds, format = "csv") => {
    // Get deals data
    const response = await dealsAPI.getDeals({
      limit: dealIds.length || 10000,
      page: 1,
      sortBy: "createdAt",
      sortOrder: "desc",
    });

    return response;
  },

  // Search deals
  searchDeals: async (query, limit = 10) => {
    return apiRequest("/deals", {
      params: { search: query, limit },
    });
  },

  // Get deal statistics
  getDealStats: async () => {
    try {
      const response = await apiRequest("/deals", { params: { limit: 1 } });
      return {
        success: true,
        data: {
          total: response.total || 0,
          totalValue: response.totalValue || 0,
          weightedValue: response.weightedValue || 0,
        },
      };
    } catch (error) {
      console.error("Error getting deal stats:", error);
      throw error;
    }
  },

  // Get filter options
  getFilterOptions: async () => {
    try {
      const response = await apiRequest("/deals", { params: { limit: 1 } });
      return response.filters || {};
    } catch (error) {
      console.error("Error fetching filter options:", error);
      return { stages: [], owners: [], companies: [] };
    }
  },
};

export default dealsAPI;
