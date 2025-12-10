import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Get API URL from environment variables
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    // Check for token in both possible locations
    const token = localStorage.getItem('token') || localStorage.getItem('crm_token');
    const storedUser = localStorage.getItem('user') || localStorage.getItem('crm_user');
    
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        // Migrate to standard keys if using old ones
        if (localStorage.getItem('crm_token')) {
          localStorage.setItem('token', token);
          localStorage.setItem('user', storedUser);
        }
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('crm_token');
        localStorage.removeItem('user');
        localStorage.removeItem('crm_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log('🔐 Making login API call to backend...');
      console.log('🌐 API URL:', `${API_URL}/auth/login`);
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
    
      console.log('📡 Response status:', response.status);
      
      const data = await response.json();
      console.log('📡 Login API response:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
    
      // Store in BOTH for compatibility during transition
      localStorage.setItem('token', data.token);
      localStorage.setItem('crm_token', data.token); // Keep for backward compatibility
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('crm_user', JSON.stringify(data.user)); // Keep for backward compatibility
      
      setUser(data.user);
      
      return {
        success: true,
        user: data.user,
        token: data.token
      };
      
    } catch (error) {
      console.error('🚨 Login error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      console.log('📝 Making registration API call to backend...');
      console.log('🌐 API URL:', `${API_URL}/auth/register`);
      
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      console.log('📡 Registration API response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Store in BOTH for compatibility
      localStorage.setItem('token', data.token);
      localStorage.setItem('crm_token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('crm_user', JSON.stringify(data.user));
      
      setUser(data.user);
      
      return {
        success: true,
        user: data.user,
        token: data.token
      };
    } catch (error) {
      console.error('🚨 Registration error:', error);
      return {
        success: false,
        error: error.message || 'Network error occurred'
      };
    }
  };

  const logout = () => {
    // Remove ALL token storage locations
    localStorage.removeItem('token');
    localStorage.removeItem('crm_token');
    localStorage.removeItem('user');
    localStorage.removeItem('crm_user');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};