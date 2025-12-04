const API_URL = import.meta.env.VITE_API_URL;

// Helper function for API calls
const apiRequest = async (endpoint, options = {}) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
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
    console.error("API request failed:", error);
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

// Account API Functions
const accountsAPI = {
  // Get all accounts with filters
  fetchAccounts: async (params = {}) => {
    const queryParams = new URLSearchParams();

    // Add all filter parameters
    Object.keys(params).forEach((key) => {
      if (
        params[key] !== undefined &&
        params[key] !== null &&
        params[key] !== ""
      ) {
        queryParams.append(key, params[key]);
      }
    });

    const queryString = queryParams.toString();
    const url = `/accounts${queryString ? `?${queryString}` : ""}`;

    return apiRequest(url);
  },

  // Get single account by ID
  fetchAccount: async (id) => {
    return apiRequest(`/accounts/${id}`);
  },

  // Create new account
  createAccount: async (accountData) => {
    // Check if there's a file to upload
    if (accountData.image && accountData.image instanceof File) {
      const formData = new FormData();
      const { image, ...accountDataWithoutImage } = accountData;
      formData.append("data", JSON.stringify(accountDataWithoutImage));
      formData.append("image", image);
      return apiRequestWithFile("/accounts", formData, "POST");
    }

    return apiRequest("/accounts", {
      method: "POST",
      body: JSON.stringify(accountData),
    });
  },

  // Update existing account
  updateAccount: async (id, accountData) => {
    // Check if there's a file to upload or remove
    if (accountData.image instanceof File || accountData.removeImage) {
      const formData = new FormData();
      const { image, removeImage, ...accountDataWithoutImage } = accountData;
      formData.append("data", JSON.stringify(accountDataWithoutImage));

      if (accountData.image instanceof File) {
        formData.append("image", accountData.image);
      }

      return apiRequestWithFile(`/accounts/${id}`, formData, "PUT");
    }

    return apiRequest(`/accounts/${id}`, {
      method: "PUT",
      body: JSON.stringify(accountData),
    });
  },

  // Delete account (soft delete)
  deleteAccount: async (id) => {
    return apiRequest(`/accounts/${id}`, {
      method: "DELETE",
    });
  },

  // Hard delete account
  hardDeleteAccount: async (id) => {
    return apiRequest(`/accounts/${id}/hard`, {
      method: "DELETE",
    });
  },

  // Bulk delete accounts
  bulkDeleteAccounts: async (accountIds) => {
    return apiRequest("/accounts/bulk-delete", {
      method: "POST",
      body: JSON.stringify({ accountIds }),
    });
  },

  // Bulk update accounts
  bulkUpdateAccounts: async (accountIds, updates) => {
    return apiRequest("/accounts/bulk-update", {
      method: "PUT",
      body: JSON.stringify({ accountIds, updates }),
    });
  },

  // Bulk create accounts
  bulkCreateAccounts: async (accounts) => {
    return apiRequest("/accounts/bulk-create", {
      method: "POST",
      body: JSON.stringify({ accounts }),
    });
  },

  // Get account statistics
  getAccountsCount: async () => {
    return apiRequest("/accounts/count");
  },

  // Get all accounts (alias for fetchAccounts)
  getAllAccounts: async (params = {}) => {
    return accountsAPI.fetchAccounts(params);
  },
};

export default accountsAPI;
