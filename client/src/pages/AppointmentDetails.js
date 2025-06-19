import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-toastify';

// Material UI components
import {
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Box,
  Chip,
  Divider,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const AppointmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await api.get(`/api/appointments/${id}`);
        setAppointment(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching appointment details:', err);
        setError('Failed to fetch appointment details');
        setLoading(false);
        toast.error('Failed to load appointment details');
      }
    };

    fetchAppointment();
  }, [id]);

  const handleCancel = async () => {
    try {
      await api.delete(`/api/appointments/${id}`);
      toast.success('Appointment cancelled successfully');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Failed to cancel appointment');
    }
    setOpenDialog(false);
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString) => {
    // Handle time string format (HH:MM)
    if (typeof timeString === 'string' && timeString.includes(':')) {
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    }
    return timeString || 'N/A';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="error">{error}</Typography>
          <Button 
            variant="contained" 
            sx={{ mt: 2 }} 
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
        </Paper>
      </Container>
    );
  }

  if (!appointment) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">Appointment not found</Typography>
          <Button 
            variant="contained" 
            sx={{ mt: 2 }} 
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Appointment Details
        </Typography>
        
        <Box sx={{ mt: 2, mb: 3 }}>
          <Chip 
            label={appointment.status} 
            color={
              appointment.status === 'scheduled' ? 'success' : 
              appointment.status === 'pending' ? 'warning' : 
              appointment.status === 'cancelled' ? 'error' : 
              'default'
            } 
            sx={{ fontWeight: 'bold' }}
          />
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <EventIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body1">
                <strong>Date:</strong> {formatDate(appointment.date)}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AccessTimeIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body1">
                <strong>Time:</strong> {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body1">
                <strong>Service:</strong> {appointment.service?.name || 'N/A'}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body1">
                <strong>Provider:</strong> {appointment.business?.name || 'N/A'}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body1">
                <strong>Location:</strong> {appointment.business?.address || 'N/A'}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        
        {appointment.notes && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" gutterBottom>Notes</Typography>
            <Typography variant="body1">{appointment.notes}</Typography>
          </>
        )}
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
          
          <Box>
            {appointment.status !== 'cancelled' && new Date(appointment.date) > new Date() && (
              <>
                <Button 
                  variant="contained" 
                  color="primary"
                  component={RouterLink}
                  to={`/appointments/reschedule/${appointment._id}`}
                  sx={{ mr: 2 }}
                >
                  Reschedule
                </Button>
                <Button 
                  variant="contained" 
                  color="error"
                  onClick={() => setOpenDialog(true)}
                >
                  Cancel Appointment
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Paper>
      
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>Cancel Appointment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel this appointment? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>No, Keep It</Button>
          <Button onClick={handleCancel} color="error" autoFocus>
            Yes, Cancel It
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AppointmentDetails; 