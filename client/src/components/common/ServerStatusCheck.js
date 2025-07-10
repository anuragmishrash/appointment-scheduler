import React, { useState, useEffect } from 'react';
import { Alert, Snackbar, Link, Button } from '@mui/material';
import axios from 'axios';

const ServerStatusCheck = () => {
  const [serverDown, setServerDown] = useState(false);
  const [open, setOpen] = useState(false);
  const [checkCount, setCheckCount] = useState(0);

  // Get the API URL based on environment
  const getApiUrl = () => {
    if (process.env.NODE_ENV === 'production') {
      return 'https://appointment-scheduler-ah4f.onrender.com';
    }
    return process.env.REACT_APP_API_URL || 'http://localhost:5000';
  };

  // Check if the server is available
  const checkServerStatus = async () => {
    try {
      await axios.get(`${getApiUrl()}/`, { 
        timeout: 3000,
        withCredentials: false // Avoid CORS issues with the health check
      });
      if (serverDown) {
        // Server is back online after being down
        setServerDown(false);
        setOpen(true);
      }
    } catch (error) {
      console.error('Server status check failed:', error.message);
      setServerDown(true);
      setOpen(true);
    }
    
    // Increment check count to track how many times we've checked
    setCheckCount(prev => prev + 1);
  };

  useEffect(() => {
    // Initial check when component mounts
    checkServerStatus();
    
    // Set up interval for checking server status
    const interval = setInterval(() => {
      checkServerStatus();
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  // Only show the alert if we've checked at least once and server is down
  // or if server was down and is now back up
  if ((checkCount > 0 && serverDown) || (checkCount > 1 && !serverDown && open)) {
    return (
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ mt: 8 }}
      >
        <Alert
          severity={serverDown ? "error" : "success"}
          variant="filled"
          onClose={handleClose}
          sx={{ width: '100%', alignItems: 'center' }}
          action={
            serverDown && (
              <Button 
                color="inherit" 
                size="small" 
                onClick={() => checkServerStatus()}
              >
                Retry
              </Button>
            )
          }
        >
          {serverDown ? (
            <>
              Server is currently unavailable. 
              {process.env.NODE_ENV === 'development' && (
                <span> Make sure your backend server is running with: <code>cd server && npm start</code></span>
              )}
            </>
          ) : (
            'Server connection restored!'
          )}
        </Alert>
      </Snackbar>
    );
  }

  return null;
};

export default ServerStatusCheck; 