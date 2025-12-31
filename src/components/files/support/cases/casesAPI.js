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

// Case CRUD Operations
export const casesAPI = {
    // Get all cases with filters
    getCases: async (filters = {}) => {
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
        const url = `/cases${queryString ? `?${queryString}` : ""}`;

        return apiRequest(url);
    },

    // Get single case
    getCase: async (id) => {
        return apiRequest(`/cases/${id}`);
    },

    // Create new case
    createCase: async (caseData) => {
        return apiRequest("/cases", {
            method: "POST",
            body: JSON.stringify(caseData),
        });
    },

    // Update case
    updateCase: async (id, caseData) => {
        return apiRequest(`/cases/${id}`, {
            method: "PUT",
            body: JSON.stringify(caseData),
        });
    },

    // Delete case
    deleteCase: async (id) => {
        return apiRequest(`/cases/${id}`, {
            method: "DELETE",
        });
    },

    // Bulk operations
    bulkUpdateCases: async (caseIds, updates) => {
        return apiRequest("/cases/bulk-update", {
            method: "POST",
            body: JSON.stringify({ caseIds, updates }),
        });
    },

    bulkDeleteCases: async (caseIds) => {
        return apiRequest("/cases/bulk-delete", {
            method: "POST",
            body: JSON.stringify({ caseIds }),
        });
    },
};
