import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import api from '../../api/axios';

const ServerStatusCheck = ({ onStatusChange }) => {
  const [status, setStatus] = useState('checking');
  const [retryCount, setRetryCount] = useState(0);
  const [retryTimer, setRetryTimer] = useState(null);

  const checkServerStatus = async () => {
    try {
      setStatus('checking');
      // Try to hit a simple endpoint that doesn't require auth
      await api.get('/api/health', { timeout: 5000 });
      setStatus('online');
      if (onStatusChange) onStatusChange('online');
      return true;
    } catch (error) {
      console.error('Server health check failed:', error.message);
      setStatus('offline');
      if (onStatusChange) onStatusChange('offline');
      return false;
    }
  };

  useEffect(() => {
    checkServerStatus();

    // Set up regular checks
    const intervalId = setInterval(() => {
      checkServerStatus();
    }, 30000); // Check every 30 seconds

    return () => {
      clearInterval(intervalId);
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, []);

  useEffect(() => {
    // If server is offline, schedule retries with increasing delay
    if (status === 'offline') {
      if (retryCount < 5) { // Limit to 5 retries
        const delay = Math.min(2000 * Math.pow(1.5, retryCount), 30000); // Exponential backoff capped at 30s
        const timer = setTimeout(() => {
          setRetryCount(prev => prev + 1);
          checkServerStatus();
        }, delay);
        
        setRetryTimer(timer);
        
        return () => {
          clearTimeout(timer);
        };
      }
    } else if (status === 'online') {
      // Reset retry count when back online
      setRetryCount(0);
    }
  }, [status, retryCount]);

  if (status === 'online') {
    return null; // Don't show anything when server is online
  }

  return (
    <Box sx={{ mb: 2, width: '100%' }}>
      {status === 'checking' ? (
        <Alert severity="info" icon={<CircularProgress size={20} />}>
          Checking server status...
        </Alert>
      ) : (
        <Alert severity="warning">
          <Typography variant="body2">
            Server connection issue detected. {retryCount > 0 ? `Retrying... (${retryCount}/5)` : 'Will retry soon.'}
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
            The server might be waking up from sleep mode. Please wait a moment.
          </Typography>
        </Alert>
      )}
    </Box>
  );
};

export default ServerStatusCheck; 