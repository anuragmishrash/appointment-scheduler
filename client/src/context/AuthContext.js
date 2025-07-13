import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [serverWakingUp, setServerWakingUp] = useState(false);
  const [authAttemptCount, setAuthAttemptCount] = useState(0);

  // Set token in axios headers
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Clear any auth errors when token changes
  useEffect(() => {
    if (token) {
      setAuthError(null);
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
        setServerWakingUp(false); // Reset server waking up state
        const res = await api.get('/api/auth/profile');
        setUser(res.data);
        setAuthAttemptCount(0); // Reset attempt count on success
      } catch (error) {
        console.error('Error loading user:', error);
        
        // Check if it's a token issue
        if (error.response && error.response.status === 401) {
          setAuthError('Session expired or invalid. Please log in again.');
          toast.error('Your session has expired. Please log in again.');
          logout();
        } else if (!error.response) {
          // Network error - could be server waking up
          setAuthAttemptCount(prevCount => {
            const newCount = prevCount + 1;
            
            // If we've had multiple failed attempts, it could be a server spin-up delay
            if (newCount >= 2) {
              setServerWakingUp(true);
              toast.info("Server may be waking up from sleep mode. Please wait...", {
                autoClose: false,
                toastId: "server-waking"
              });
              
              // Try again after a delay
              const retryDelay = Math.min(2000 * Math.pow(1.5, newCount), 30000);
              setTimeout(loadUser, retryDelay);
            }
            
            return newCount;
          });
          
          setAuthError('Network error. Please check your connection.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadUser();
    
    // Check server status periodically when having issues
    let intervalId;
    if (serverWakingUp) {
      intervalId = setInterval(async () => {
        try {
          // Try a simple health check
          await api.get('/api/health');
          setServerWakingUp(false);
          toast.dismiss("server-waking");
          toast.success("Server is now available!");
          loadUser(); // Try loading the user again
          clearInterval(intervalId);
        } catch (error) {
          // Still unavailable
        }
      }, 5000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [token, serverWakingUp]);

  // Register user
  const register = async (userData) => {
    try {
      // Clear any previous errors
      setAuthError(null);
      
      // Ensure the required fields are present and not undefined
      if (!userData.name || !userData.email || !userData.password) {
        const errorMsg = 'Name, email and password are required fields';
        setAuthError(errorMsg);
        toast.error(errorMsg);
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
      
      // Store authentication data
      setToken(res.data.token);
      setUser(res.data);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data._id);
      
      toast.success('Registration successful!');
      return true;
    } catch (error) {
      console.error('Registration error details:', error);
      
      let errorMsg = 'Registration failed';
      
      if (error.response) {
        errorMsg = error.response.data.message || errorMsg;
        
        // Handle specific error cases
        if (error.response.data.details) {
          console.error('Registration error details:', error.response.data.details);
        }
      } else if (error.request) {
        // Network error
        errorMsg = 'Network error. Please check your connection and try again.';
      }
      
      setAuthError(errorMsg);
      toast.error(errorMsg);
      return false;
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      // Clear any previous errors
      setAuthError(null);
      
      // Validate inputs
      if (!email || !password) {
        const errorMsg = 'Email and password are required';
        setAuthError(errorMsg);
        toast.error(errorMsg);
        return false;
      }
      
      // Clear any existing tokens before attempting login
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      
      const res = await api.post('/api/auth/login', { email, password });
      
      // Store authentication data
      setToken(res.data.token);
      setUser(res.data);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data._id);
      
      toast.success('Login successful!');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMsg = 'Login failed';
      
      if (error.response) {
        errorMsg = error.response.data.message || errorMsg;
        
        // Handle specific error cases
        if (error.response.status === 401) {
          errorMsg = 'Invalid email or password';
        } else if (error.response.status === 500) {
          if (error.response.data.message && error.response.data.message.includes('JWT_SECRET')) {
            errorMsg = 'Server configuration error. Please contact support.';
          } else {
            errorMsg = 'Server error. Please try again later.';
          }
        }
      } else if (error.request) {
        // Network error
        errorMsg = 'Network error. Please check your connection and try again.';
      }
      
      setAuthError(errorMsg);
      toast.error(errorMsg);
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
      
      // If token is included in response, update it
      if (res.data.token) {
        setToken(res.data.token);
        localStorage.setItem('token', res.data.token);
      }
      
      toast.success('Profile updated successfully!');
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      
      let errorMsg = 'Profile update failed';
      
      if (error.response) {
        errorMsg = error.response.data.message || errorMsg;
      } else if (error.request) {
        errorMsg = 'Network error. Please check your connection.';
      }
      
      toast.error(errorMsg);
      return false;
    }
  };

  // Clear auth errors (useful for form resets)
  const clearAuthError = () => {
    setAuthError(null);
  };

  const value = {
    user,
    token,
    loading,
    authError,
    serverWakingUp,
    register,
    login,
    logout,
    updateProfile,
    clearAuthError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 