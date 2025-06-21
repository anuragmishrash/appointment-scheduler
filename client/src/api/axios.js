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
  withCredentials: true
});

// Add a request interceptor to include the token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          window.location.href = '/login';
        }
      }
      
      // Log detailed error information
      console.error('Response error:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else {
      // Network errors or other issues without a response
      console.error('Network error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api; 