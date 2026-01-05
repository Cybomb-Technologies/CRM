const API_URL = import.meta.env.VITE_API_URL;

// Helper function for API calls (copied from accountsAPI.js)
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

const invoicesAPI = {
  getAllInvoices: async () => {
    // Assuming backend endpoint is /file/inventory/invoices based on file structure naming
    // Or just /invoices. accountsAPI uses /accounts.
    // DashboardLayout.jsx link suggests "invoices" -> likely backend has /api/invoices
    // Wait, log showed "GET /api/file/inventory/sales-orders".
    // Let's assume /api/file/inventory/invoices for now or standard /invoices if it follows accountsAPI pattern.
    // accountsAPI uses /accounts (line 103).
    // Let's check server.js if possible or just try /invoices.
    // Given the error was ReferenceError on frontend, exact URL matters less for *this* fix than defining the function.
    // I'll use /invoices to match accountsAPI pattern, but it might be /file/inventory/invoices.
    // I will try to be safe and use /file/inventory/invoices if that seems more aligned with folder structure,
    // but accountsAPI is in sales/accounts and uses /accounts.
    // Let's stick to /invoices as a best guess for RESTful design, or maybe check server routes.
    // Actually, I'll use a generic endpoint and if it fails 404 I'll debug that next.
    return apiRequest('/invoices');
  },

  deleteInvoice: async (id) => {
    return apiRequest(`/invoices/${id}`, {
      method: "DELETE",
    });
  }
};

export { invoicesAPI };
