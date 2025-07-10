import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import axios from '../../api/axios';

const ServerStatusCheck = () => {
  const [serverStatus, setServerStatus] = useState('checking');
  const [retryCount, setRetryCount] = useState(0);
  const [coldStartDetected, setColdStartDetected] = useState(false);

  useEffect(() => {
    checkServerStatus();
  }, []);

  const checkServerStatus = () => {
    setServerStatus('checking');
    
    axios.get('/api/health')
      .then(() => {
        setServerStatus('online');
        setColdStartDetected(false);
      })
      .catch(err => {
        if (retryCount < 3) {
          setRetryCount(prev => prev + 1);
          // If we've tried twice and failed, it's likely a cold start
          if (retryCount >= 1) {
            setColdStartDetected(true);
          }
          setTimeout(checkServerStatus, 5000); // Retry after 5 seconds
        } else {
          setServerStatus('offline');
        }
      });
  };

  const handleRetry = () => {
    setRetryCount(0);
    checkServerStatus();
  };

  if (serverStatus === 'online') return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        p: 2,
        backgroundColor: serverStatus === 'checking' ? '#1976d2' : '#d32f2f',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
        boxShadow: 3,
      }}
    >
      {serverStatus === 'checking' && (
        <>
          <CircularProgress color="inherit" size={20} />
          <Typography variant="body1">
            {coldStartDetected 
              ? "Server is waking up from sleep mode. This may take up to 60 seconds..." 
              : "Connecting to server..."}
          </Typography>
        </>
      )}
      
      {serverStatus === 'offline' && (
        <>
          <Typography variant="body1">Server is currently unavailable.</Typography>
          <Button 
            variant="contained" 
            color="inherit" 
            size="small"
            onClick={handleRetry}
          >
            Retry
          </Button>
        </>
      )}
    </Box>
  );
};

export default ServerStatusCheck; 