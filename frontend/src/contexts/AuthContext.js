import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

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
    const initAuth = async () => {
      const token = localStorage.getItem('bookHubToken');

      if (token) {
        try {
          const response = await api.get('/auth/profile');
          setUser(response.data);
          localStorage.setItem('bookHubUser', JSON.stringify(response.data));
        } catch (error) {
          console.error('Failed to fetch profile:', error);
          logout();
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  const register = async (email, password, name) => {
    try {
      const response = await api.post('/auth/register', {
        email,
        password,
        first_name: name,
        last_name: ''
      });

      if (response.status === 201) {
        return { success: true, message: 'Registration successful' };
      }

      return { success: false, message: 'Registration failed' };
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user: loggedUser, token } = response.data;

      setUser(loggedUser);
      localStorage.setItem('bookHubUser', JSON.stringify(loggedUser));
      localStorage.setItem('bookHubToken', token);

      return { success: true, user: loggedUser };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Invalid credentials',
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bookHubUser');
    localStorage.removeItem('bookHubToken');
  };

  const isAdmin = () => {
    return user?.role === 'admin' || user?.email === 'admin@gmail.com';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
