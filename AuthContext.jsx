import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('skillconnect_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('skillconnect_token') || null);
  const [loading, setLoading] = useState(true);

  // Sync user state with backend on initial load
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('skillconnect_token');
      if (savedToken) {
        try {
          const res = await API.get('/auth/me');
          setUser(res.data);
          localStorage.setItem('skillconnect_user', JSON.stringify(res.data));
        } catch (err) {
          console.error('Session restoration failed:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    const { token: receivedToken, user: receivedUser } = res.data;

    setToken(receivedToken);
    setUser(receivedUser);
    localStorage.setItem('skillconnect_token', receivedToken);
    localStorage.setItem('skillconnect_user', JSON.stringify(receivedUser));
    return receivedUser;
  };

  const register = async (userData) => {
    const res = await API.post('/auth/register', userData);
    const { token: receivedToken, user: receivedUser } = res.data;

    setToken(receivedToken);
    setUser(receivedUser);
    localStorage.setItem('skillconnect_token', receivedToken);
    localStorage.setItem('skillconnect_user', JSON.stringify(receivedUser));
    return receivedUser;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('skillconnect_token');
    localStorage.removeItem('skillconnect_user');
  };

  const refreshUser = async () => {
    try {
      const res = await API.get('/auth/me');
      setUser(res.data);
      localStorage.setItem('skillconnect_user', JSON.stringify(res.data));
      return res.data;
    } catch (err) {
      console.error('Failed to refresh user profile:', err);
      return null;
    }
  };

  const updateUserData = (updatedFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('skillconnect_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
        refreshUser,
        updateUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
