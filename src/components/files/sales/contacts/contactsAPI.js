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
  if (
    config.body &&
    typeof config.body === "object" &&
    !(config.body instanceof FormData)
  ) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);

    if (!response.ok) {
      // Handle 401 unauthorized
      if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
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

// Helper function for file uploads
const apiRequestWithFile = async (endpoint, formData, method = "POST") => {
  try {
    const config = {
      method: method,
      body: formData,
    };

    // Add auth token if available
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`,
      };
    }

    const response = await fetch(`${API_URL}${endpoint}`, config);

    if (!response.ok) {
      // Handle 401 unauthorized
      if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
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
    console.error("API request with file failed:", error);
    throw error;
  }
};

const contactsAPI = {
  // Get all contacts with optional filters
  getContacts: async (params = {}) => {
    return apiRequest("/contacts", { params });
  },

  // Get single contact by ID
  getContactById: async (id) => {
    return apiRequest(`/contacts/${id}`);
  },

  // Create new contact
  createContact: async (contactData) => {
    // Check if there's a file to upload
    if (contactData.image && contactData.image instanceof File) {
      const formData = new FormData();
      const { image, ...contactDataWithoutImage } = contactData;
      formData.append("data", JSON.stringify(contactDataWithoutImage));
      formData.append("image", image);
      return apiRequestWithFile("/contacts", formData, "POST");
    }

    return apiRequest("/contacts", {
      method: "POST",
      body: contactData,
    });
  },

  // Update contact
  updateContact: async (id, contactData) => {
    // Clean the data - remove empty fields
    const cleanData = { ...contactData };
    Object.keys(cleanData).forEach((key) => {
      if (cleanData[key] === "" && key !== "email" && key !== "phone") {
        delete cleanData[key];
      }
    });

    if (!id || id === "undefined" || id === "null") {
      throw new Error("Invalid contact ID");
    }

    // Check if there's a file to upload or remove
    if (contactData.image instanceof File || contactData.removeImage) {
      const formData = new FormData();
      const { image, removeImage, ...contactDataWithoutImage } = contactData;
      formData.append("data", JSON.stringify(contactDataWithoutImage));

      if (contactData.image instanceof File) {
        formData.append("image", contactData.image);
      }

      return apiRequestWithFile(`/contacts/${id}`, formData, "PUT");
    }

    return apiRequest(`/contacts/${id}`, {
      method: "PUT",
      body: cleanData,
    });
  },

  // Delete contact
  deleteContact: async (id) => {
    return apiRequest(`/contacts/${id}`, {
      method: "DELETE",
    });
  },

  // Bulk update contacts
  bulkUpdateContacts: async (contactIds, updates) => {
    return apiRequest("/contacts/bulk/update", {
      method: "PUT",
      body: { contactIds, updates },
    });
  },

  // Bulk delete contacts
  bulkDeleteContacts: async (contactIds) => {
    return apiRequest("/contacts/bulk/delete", {
      method: "DELETE",
      body: { contactIds },
    });
  },

  // Get filter options
  getFilterOptions: async () => {
    try {
      const response = await apiRequest("/contacts", { params: { limit: 1 } });
      return response.filters || {};
    } catch (error) {
      console.error("Error fetching filter options:", error);
      return { accounts: [], departments: [], leadSources: [] };
    }
  },

  // Export contacts
  exportContacts: async (format = "csv", filters = {}) => {
    // Clean filters - remove "all" values
    const cleanFilters = {};
    Object.keys(filters).forEach((key) => {
      if (
        filters[key] &&
        filters[key] !== "all" &&
        filters[key] !== "no-change"
      ) {
        if (
          key === "contactIds" &&
          Array.isArray(filters[key]) &&
          filters[key].length > 0
        ) {
          cleanFilters.contactIds = filters[key];
        } else if (key !== "contactIds") {
          cleanFilters[key] = filters[key];
        }
      }
    });

    // Get all contacts with filters
    const params = {
      ...cleanFilters,
      limit: 10000,
      page: 1,
      sortBy: "createdAt",
      sortOrder: "desc",
    };

    return apiRequest("/contacts", { params });
  },

  // Search contacts
  searchContacts: async (query, limit = 10) => {
    return apiRequest("/contacts", {
      params: { search: query, limit },
    });
  },

  // Get filter values
  getFilterValues: async () => {
    try {
      const response = await apiRequest("/contacts");
      return {
        success: true,
        data: response.filters || {},
      };
    } catch (error) {
      console.error("Error getting filter values:", error);
      throw error;
    }
  },

  // Get contact stats
  getContactStats: async () => {
    try {
      const response = await apiRequest("/contacts", { params: { limit: 1 } });
      return {
        success: true,
        data: {
          total: response.total || 0,
          stats: response.stats || {},
        },
      };
    } catch (error) {
      console.error("Error getting contact stats:", error);
      throw error;
    }
  },

  // Convert lead to contact
  convertLeadToContact: async (
    leadData,
    accountData = null,
    dealData = null
  ) => {
    return apiRequest("/contacts/convert-from-lead", {
      method: "POST",
      body: { leadData, accountData, dealData },
    });
  },

  // Sync contact from lead
  syncContactFromLead: async (contactId, leadData) => {
    return apiRequest(`/contacts/${contactId}/sync-from-lead`, {
      method: "PUT",
      body: leadData,
    });
  },

  // Merge contacts
  mergeContacts: async (
    primaryContactId,
    duplicateContactIds,
    mergeFields = {}
  ) => {
    return apiRequest("/contacts/merge", {
      method: "POST",
      body: { primaryContactId, duplicateContactIds, mergeFields },
    });
  },

  // Import contacts
  importContacts: async (contacts, overwrite = false) => {
    return apiRequest("/contacts/import", {
      method: "POST",
      body: { contacts, overwrite },
    });
  },

  // Get all contacts (alias for getContacts)
  getAllContacts: async (params = {}) => {
    return contactsAPI.getContacts(params);
  },
};

export default contactsAPI;
