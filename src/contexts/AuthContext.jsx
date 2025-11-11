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

  useEffect(() => {
    const storedUser = localStorage.getItem('crm_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: email,
      role: 'Admin',
      team: 'Sales',
      avatar: null,
      permissions: {
        leads: { create: true, read: true, update: true, delete: true },
        accounts: { create: true, read: true, update: true, delete: true },
        contacts: { create: true, read: true, update: true, delete: true },
        deals: { create: true, read: true, update: true, delete: true },
        activities: { create: true, read: true, update: true, delete: true },
        tickets: { create: true, read: true, update: true, delete: true },
        products: { create: true, read: true, update: true, delete: true },
        quotes: { create: true, read: true, update: true, delete: true },
        reports: { create: true, read: true, update: true, delete: true },
        workflows: { create: true, read: true, update: true, delete: true },
        settings: { create: true, read: true, update: true, delete: true }
      }
    };
    localStorage.setItem('crm_user', JSON.stringify(mockUser));
    setUser(mockUser);
    return mockUser;
  };

  const logout = () => {
    localStorage.removeItem('crm_user');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};