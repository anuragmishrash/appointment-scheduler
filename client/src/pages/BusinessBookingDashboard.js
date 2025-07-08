import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import notificationService from '../services/NotificationService';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  CircularProgress,
  Divider,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  Paper
} from '@mui/material';
import { toast } from 'react-toastify';
import AddIcon from '@mui/icons-material/Add';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NotificationsIcon from '@mui/icons-material/Notifications';

// TabPanel component for tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`appointment-tabpanel-${index}`}
      aria-labelledby={`appointment-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const BusinessBookingDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNotificationBanner, setShowNotificationBanner] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get('/api/appointments');
        // For business users, only show appointments where they are the customer, not the provider
        if (user && user.role === 'business') {
          // Filter out appointments where the user is the business (provider)
          // Only show appointments where they are the customer
          const customerAppointments = res.data.filter(
            appointment => !appointment.isBusinessAppointment
          );
          setAppointments(customerAppointments);
        }
        
        // Schedule notifications for upcoming appointments
        if (res.data && res.data.length > 0) {
          // Initialize notification service first
          await notificationService.initialize();
          // Then schedule notifications
          notificationService.scheduleAppointmentNotifications(res.data);
        }
        
        setError('');
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setError('Failed to load appointments');
        toast.error('Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAppointments();
      
      // Check if we should show notification permission banner
      if (notificationService.hasSupport && notificationService.permission !== 'granted') {
        setShowNotificationBanner(true);
      }
    }
    
    // Cleanup notifications when component unmounts
    return () => {
      notificationService.clearAllNotifications();
    };
  }, [user]);

  const handleCancelAppointment = async (id) => {
    try {
      await api.put(`/api/appointments/${id}`, { status: 'cancelled' });
      
      // Update the local state
      setAppointments(
        appointments.map((appointment) =>
          appointment._id === id
            ? { ...appointment, status: 'cancelled' }
            : appointment
        )
      );
      
      toast.success('Appointment cancelled successfully');
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel appointment');
    }
  };

  const handleEnableNotifications = async () => {
    try {
      await notificationService.requestPermission();
      setShowNotificationBanner(false);
      
      if (notificationService.permission === 'granted') {
        toast.success('Notifications enabled');
      } else {
        toast.info('Notification permission denied');
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast.error('Failed to enable notifications');
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'primary';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'rescheduled':
        return 'warning';
      case 'missed':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderAppointmentCard = (appointment) => (
    <Grid item xs={12} sm={6} md={4} key={appointment._id}>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" component="div">
              {appointment.service?.name || 'Service'}
            </Typography>
            <Chip
              label={appointment.status}
              color={getStatusColor(appointment.status)}
              size="small"
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <EventIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2">
              {formatDate(appointment.date)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2">
              {appointment.startTime} - {appointment.endTime}
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Provider: {appointment.business?.name || 'Provider'}
          </Typography>
          {appointment.notes && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Notes: {appointment.notes}
            </Typography>
          )}
        </CardContent>
        <CardActions>
          <Button
            size="small"
            component={RouterLink}
            to={`/appointments/${appointment._id}`}
          >
            View Details
          </Button>
          {appointment.status === 'scheduled' && (
            <Button
              size="small"
              color="error"
              onClick={() => handleCancelAppointment(appointment._id)}
            >
              Cancel
            </Button>
          )}
        </CardActions>
      </Card>
    </Grid>
  );

  // Filter appointments by status
  const scheduledAppointments = appointments.filter(appointment => appointment.status === 'scheduled');
  const cancelledAppointments = appointments.filter(appointment => appointment.status === 'cancelled');
  const missedAppointments = appointments.filter(appointment => appointment.status === 'missed');

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Snackbar
        open={showNotificationBanner}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          severity="info" 
          action={
            <Button 
              color="inherit" 
              size="small" 
              startIcon={<NotificationsIcon />}
              onClick={handleEnableNotifications}
            >
              Enable
            </Button>
          }
          onClose={() => setShowNotificationBanner(false)}
        >
          Enable notifications to receive appointment reminders
        </Alert>
      </Snackbar>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          My Bookings
        </Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            component={RouterLink}
            to="/appointments/new"
            sx={{ mr: 2 }}
          >
            Book Appointment
          </Button>
          <Button
            variant="outlined"
            component={RouterLink}
            to="/calendar"
          >
            Calendar View
          </Button>
        </Box>
      </Box>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Welcome back, {user?.name}!
      </Typography>

      <Divider sx={{ mb: 4 }} />

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {appointments.length === 0 ? (
        <Card sx={{ mb: 4, p: 2 }}>
          <CardContent>
            <Typography variant="body1" align="center">
              You don't have any appointments yet.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                variant="contained"
                component={RouterLink}
                to="/appointments/new"
                startIcon={<AddIcon />}
              >
                Book Your First Appointment
              </Button>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Paper sx={{ width: '100%', mb: 4 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            centered
            variant="fullWidth"
            aria-label="appointment tabs"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label={`ALL APPOINTMENTS (${appointments.length})`} />
            <Tab label={`SCHEDULED (${scheduledAppointments.length})`} />
            <Tab label={`CANCELLED (${cancelledAppointments.length})`} />
            <Tab label={`MISSED (${missedAppointments.length})`} />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              {appointments.map(renderAppointmentCard)}
            </Grid>
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            {scheduledAppointments.length === 0 ? (
              <Typography variant="body1" align="center" sx={{ py: 4 }}>
                You don't have any scheduled appointments.
              </Typography>
            ) : (
              <Grid container spacing={3}>
                {scheduledAppointments.map(renderAppointmentCard)}
              </Grid>
            )}
          </TabPanel>
          
          <TabPanel value={tabValue} index={2}>
            {cancelledAppointments.length === 0 ? (
              <Typography variant="body1" align="center" sx={{ py: 4 }}>
                You don't have any cancelled appointments.
              </Typography>
            ) : (
              <Grid container spacing={3}>
                {cancelledAppointments.map(renderAppointmentCard)}
              </Grid>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            {missedAppointments.length === 0 ? (
              <Typography variant="body1" align="center" sx={{ py: 4 }}>
                You don't have any missed appointments.
              </Typography>
            ) : (
              <Grid container spacing={3}>
                {missedAppointments.map(renderAppointmentCard)}
              </Grid>
            )}
          </TabPanel>
        </Paper>
      )}
    </Box>
  );
};

export default BusinessBookingDashboard; 