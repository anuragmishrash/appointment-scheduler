import axios from 'axios';

// Determine the base URL based on environment
const getBaseURL = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://appointment-scheduler-ah4f.onrender.com';
  }
  
  // For local development, try to detect if the default port is unavailable
  const localApiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  
  return localApiUrl;
};

// Create a function to test if the server is available
const testServerConnection = async (url) => {
  try {
    await axios.get(`${url}/`, { timeout: 2000 });
    console.log(`✅ Successfully connected to API at ${url}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to connect to API at ${url}:`, error.message);
    return false;
  }
};

// Initialize API with base configuration
const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
  timeout: 20000 // 20 seconds timeout
});

// Check connection and update baseURL if needed
if (process.env.NODE_ENV === 'development') {
  // In development, we'll check the connection and show helpful messages
  (async () => {
    const baseUrl = getBaseURL();
    const isConnected = await testServerConnection(baseUrl);
    
    if (!isConnected) {
      console.warn(`⚠️ Cannot connect to server at ${baseUrl}`);
      console.warn('Make sure your backend server is running with:');
      console.warn('1. cd server');
      console.warn('2. npm start');
      
      // Display a user-friendly message in the console
      console.log('%c Backend Server Not Running ', 
        'background: #FFC107; color: #000; font-size: 16px; font-weight: bold; padding: 4px;');
      console.log('%c Please start your backend server to enable API functionality ', 
        'background: #FFF3CD; color: #856404; font-size: 14px; padding: 4px;');
    }
  })();
}

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
  async (error) => {
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
      
      // For auth endpoints, try clearing localStorage on network errors
      if (error.config && error.config.url && error.config.url.includes('/api/auth/')) {
        console.log('Network error on auth endpoint, clearing local storage');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
      }
      
      // Show more helpful error message in development
      if (process.env.NODE_ENV === 'development') {
        console.log('%c Backend Server Connection Error ', 
          'background: #F8D7DA; color: #721C24; font-size: 16px; font-weight: bold; padding: 4px;');
        console.log('%c Please check if your backend server is running at ' + getBaseURL(), 
          'background: #F8D7DA; color: #721C24; font-size: 14px; padding: 4px;');
      }
      
      // Retry logic for network errors (once) on non-POST requests
      if (error.config && error.config.method && error.config.url) {
        const { method, url, _retryCount } = error.config;
        if (method !== 'post' && !_retryCount && !url.includes('/api/auth/')) {
          error.config._retryCount = 1;
          console.log(`Retrying failed request: ${method} ${url}`);
          return api(error.config);
        }
      }
    } else {
      // Something happened in setting up the request
      console.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api; 