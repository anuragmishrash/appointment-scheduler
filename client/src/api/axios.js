import axios from 'axios';

// Determine the base URL based on environment
const getBaseURL = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://appointment-scheduler-ah4f.onrender.com';
  }
  return process.env.REACT_APP_API_URL || 'http://localhost:5000';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
  timeout: 15000 // 15 second timeout to prevent hanging requests
});

// Add a request interceptor to include the token in all requests
api.interceptors.request.use(
  (config) => {
    // Get fresh token on each request
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // If no token but trying to access protected route, redirect to login
      if (config.url !== '/api/auth/login' && config.url !== '/api/auth/register') {
        console.warn('Attempting to access protected route without token');
      }
    }
    
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication errors
    if (error.response) {
      // Check for token-related errors
      if (error.response.status === 401) {
        const errorData = error.response.data;
        
        // Check if we should force logout
        if (errorData.action === 'logout') {
          console.log('Forcing logout due to token issue:', errorData.message);
          
          // Clear authentication data
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          
          // Only redirect if not already on login page to avoid redirect loops
          if (!window.location.pathname.includes('/login')) {
            // Add a small delay to ensure console messages are visible
            setTimeout(() => {
              window.location.href = '/login';
            }, 100);
          }
        }
      } else if (error.response.status === 500) {
        // Server error - check if it's related to JWT_SECRET
        const errorData = error.response.data;
        if (errorData.message && errorData.message.includes('JWT_SECRET')) {
          console.error('Server configuration error:', errorData.message);
        }
      }
      
      // Log detailed error information
      console.error('Response error:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      // Network errors or other issues without a response
      console.error('Network error - no response received:', error.message);
      
      // Check if it's a timeout
      if (error.code === 'ECONNABORTED') {
        console.error('Request timeout - server may be unavailable');
      }
    } else {
      // Something happened in setting up the request
      console.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api; 