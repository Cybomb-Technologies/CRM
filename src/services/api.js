const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to get auth headers
export const getAuthHeaders = (contentType = 'application/json') => {
  const token = localStorage.getItem('token');
  const headers = {
    'Authorization': `Bearer ${token}`
  };

  if (contentType) {
    headers['Content-Type'] = contentType;
  }

  return headers;
};

// Helper function for API requests
export const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `API request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Profile service
export const profileService = {
  // Get user profile
  getProfile: async () => {
    return apiRequest('/profile', {
      headers: getAuthHeaders()
    });
  },

  // Update profile info
  updateProfile: async (profileData) => {
    return apiRequest('/profile', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData)
    });
  },

  // Upload profile picture
  uploadProfilePicture: async (file) => {
    const formData = new FormData();
    formData.append('profilePicture', file);

    return apiRequest('/profile/picture', {
      method: 'POST',
      headers: {
        'Authorization': getAuthHeaders()['Authorization']
        // Don't set Content-Type for FormData, browser sets it automatically
      },
      body: formData
    });
  },

  // Delete profile picture
  deleteProfilePicture: async () => {
    return apiRequest('/profile/picture', {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  }
};

// Auth service
export const authService = {
  login: async (email, password) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email, password })
    });
  },

  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
  },

  getCurrentUser: async () => {
    return apiRequest('/auth/me', {
      headers: getAuthHeaders()
    });
  }
};