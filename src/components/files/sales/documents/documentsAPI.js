const API_URL = import.meta.env.VITE_API_URL;

// Helper function for API calls (copied from leadsAPI pattern)
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
            // Don't set Content-Type header for FormData, browser will set it automatically
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

export const documentsAPI = {
    // Get all documents
    getDocuments: async (filters = {}) => {
        const queryParams = new URLSearchParams();
        if (filters.search) queryParams.append("search", filters.search);
        if (filters.category) queryParams.append("category", filters.category);

        const queryString = queryParams.toString();
        const url = `/file/sales/documents${queryString ? `?${queryString}` : ""}`;

        return apiRequest(url);
    },

    // Get single document
    getDocument: async (id) => {
        return apiRequest(`/file/sales/documents/${id}`);
    },

    // Upload/Create document
    createDocument: async (docData) => {
        // Check if it's a file upload (FormData) or just metadata
        if (docData instanceof FormData) {
            return apiRequestWithFile("/file/sales/documents", docData, "POST");
        } else {
            return apiRequest("/file/sales/documents", {
                method: "POST",
                body: JSON.stringify(docData)
            });
        }
    },

    // Update document
    updateDocument: async (id, updates) => {
        return apiRequest(`/file/sales/documents/${id}`, {
            method: "PUT",
            body: JSON.stringify(updates),
        });
    },

    // Delete document
    deleteDocument: async (id) => {
        return apiRequest(`/file/sales/documents/${id}`, {
            method: "DELETE",
        });
    }
};
