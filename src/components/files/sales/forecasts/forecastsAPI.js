// src/components/files/sales/forecasts/forecastsAPI.js
const API_URL = import.meta.env.VITE_API_URL;

// Helper function for API calls (matching dealsAPI.js pattern)
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

const forecastsAPI = {
    // Get forecast statistics with filters
    getStatistics: async (params = {}) => {
        return apiRequest("/sales/forecasts/stats", { params });
    },

    // Get forecast settings
    getSettings: async () => {
        return apiRequest("/sales/forecasts/settings");
    },

    // Update forecast settings
    updateSettings: async (settingsData) => {
        return apiRequest("/sales/forecasts/settings", {
            method: "PUT",
            body: settingsData,
        });
    }
};

export default forecastsAPI;
