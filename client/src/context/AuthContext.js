import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Set token in axios headers
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Load user data if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/api/auth/profile');
        setUser(res.data);
      } catch (error) {
        console.error('Error loading user:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  // Register user
  const register = async (userData) => {
    try {
      // Ensure the required fields are present and not undefined
      if (!userData.name || !userData.email || !userData.password) {
        toast.error('Name, email and password are required fields');
        return false;
      }

      console.log('Attempting to register with data:', JSON.stringify({
        name: userData.name,
        email: userData.email,
        password: '******',
        role: userData.role
      }));
      
      // Add /api prefix for production environment
      const endpoint = process.env.NODE_ENV === 'production' 
        ? '/api/auth/register' 
        : '/api/auth/register';
        
      const res = await api.post(endpoint, userData);
      
      console.log('Registration successful, setting user data');
      setToken(res.data.token);
      setUser(res.data);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data._id);
      
      toast.success('Registration successful!');
      return true;
    } catch (error) {
      console.error('Registration error details:', error);
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return false;
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      const res = await api.post('/api/auth/login', { email, password });
      
      setToken(res.data.token);
      setUser(res.data);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data._id);
      
      toast.success('Login successful!');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return false;
    }
  };

  // Logout user
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    toast.info('Logged out successfully');
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const res = await api.put('/api/auth/profile', userData);
      
      setUser(res.data);
      localStorage.setItem('token', res.data.token);
      
      toast.success('Profile updated successfully!');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      toast.error(message);
      return false;
    }
  };

  const value = {
    user,
    token,
    loading,
    register,
    login,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 