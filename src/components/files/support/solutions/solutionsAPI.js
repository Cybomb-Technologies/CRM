const API_URL = import.meta.env.VITE_API_URL;

// Helper function for API calls
const apiRequest = async (endpoint, options = {}) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  };

  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

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

const solutionsAPI = {
  getAllSolutions: async () => {
    return apiRequest('/solutions');
  },
  
  getSolution: async (id) => {
    return apiRequest(`/solutions/${id}`);
  },

  createSolution: async (data) => {
    return apiRequest('/solutions', {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateSolution: async (id, data) => {
    return apiRequest(`/solutions/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteSolution: async (id) => {
    return apiRequest(`/solutions/${id}`, {
      method: "DELETE",
    });
  }
};

export { solutionsAPI };
