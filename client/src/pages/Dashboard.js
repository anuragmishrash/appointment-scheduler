import React, { useState, useEffect } from 'react';
import { Link as RouterLink, Navigate } from 'react-router-dom';
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
  Paper,
  IconButton,
  Badge,
  Popover,
  List,
  ListItem,
  ListItemText
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

const Dashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNotificationBanner, setShowNotificationBanner] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [autoCancelledAppointments, setAutoCancelledAppointments] = useState([]);
  const [showAutoCancelledAlert, setShowAutoCancelledAlert] = useState(false);
  const [missedAppointments, setMissedAppointments] = useState([]);
  const [showMissedAlert, setShowMissedAlert] = useState(false);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [showUpcomingAlert, setShowUpcomingAlert] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // For notifications popover
  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
    // Mark all as read when closing
    setUnreadCount(0);
  };

  const openNotifications = Boolean(anchorEl);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get('/api/appointments');
        // For regular users, just show all their appointments
        setAppointments(res.data);
        
        // Generate notifications
        const now = new Date();
        const newNotifications = [];
        let unread = 0;
        
        // Check for recently auto-cancelled appointments
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        
        const recentAutoCancelled = res.data.filter(app => {
          // Check if the appointment was auto-cancelled
          return app.status === 'cancelled' && app.autoCancelled === true;
        });
        
        if (recentAutoCancelled.length > 0) {
          setAutoCancelledAppointments(recentAutoCancelled);
          setShowAutoCancelledAlert(true);
          
          // Add to notifications
          recentAutoCancelled.forEach(app => {
            newNotifications.push({
              id: `auto-cancelled-${app._id}`,
              type: 'auto-cancelled',
              message: `Your appointment for ${formatDate(app.date)} at ${app.startTime} was auto-cancelled`,
              appointmentId: app._id,
              time: new Date(app.updatedAt || app.createdAt)
            });
            unread++;
          });
        }

        // Check for missed appointments (in last 24 hours)
        const recentMissed = res.data.filter(app => {
          const updatedAt = app.updatedAt ? new Date(app.updatedAt) : new Date(app.createdAt);
          return app.status === 'missed' && updatedAt >= oneDayAgo;
        });

        if (recentMissed.length > 0) {
          setMissedAppointments(recentMissed);
          setShowMissedAlert(true);
          
          // Add to notifications
          recentMissed.forEach(app => {
            newNotifications.push({
              id: `missed-${app._id}`,
              type: 'missed',
              message: `Your appointment for ${formatDate(app.date)} at ${app.startTime} was marked as missed`,
              appointmentId: app._id,
              time: new Date(app.updatedAt || app.createdAt)
            });
            unread++;
          });
        }

        // Check for upcoming appointments in next 10-30 minutes
        const upcomingApptsWindow = res.data.filter(app => {
          // Only look at scheduled appointments for today
          if (app.status !== 'scheduled') return false;
          
          const apptDate = new Date(app.date);
          // Check if it's today
          if (apptDate.toDateString() !== now.toDateString()) return false;

          // Parse the start time
          const [hours, minutes] = app.startTime.split(':').map(Number);
          const apptTime = new Date(apptDate);
          apptTime.setHours(hours, minutes);
          
          // Calculate time difference in minutes
          const diffMinutes = Math.floor((apptTime - now) / (1000 * 60));
          
          // Consider appointments between 10-30 minutes from now
          return diffMinutes >= 0 && diffMinutes <= 30;
        });

        if (upcomingApptsWindow.length > 0) {
          setUpcomingAppointments(upcomingApptsWindow);
          setShowUpcomingAlert(true);
          
          // Add to notifications
          upcomingApptsWindow.forEach(app => {
            const [hours, minutes] = app.startTime.split(':').map(Number);
            const apptTime = new Date(new Date(app.date));
            apptTime.setHours(hours, minutes);
            
            // Calculate time difference in minutes
            const diffMinutes = Math.floor((apptTime - now) / (1000 * 60));
            
            newNotifications.push({
              id: `upcoming-${app._id}`,
              type: 'upcoming',
              message: `Upcoming appointment in ${diffMinutes} minutes at ${app.startTime}`,
              appointmentId: app._id,
              time: new Date()
            });
            unread++;
          });
        }
        
        // Sort notifications by time (newest first)
        newNotifications.sort((a, b) => b.time - a.time);
        setNotifications(newNotifications);
        setUnreadCount(unread);
        
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

      // Set up a refresh interval to check for appointment status changes
      const intervalId = setInterval(() => {
        fetchAppointments();
      }, 60000); // Refresh every minute

      return () => {
        clearInterval(intervalId);
        notificationService.clearAllNotifications();
      };
    }
    
    // Cleanup notifications when component unmounts
    return () => {
      notificationService.clearAllNotifications();
    };
  }, [user]);

  // Handle closing the auto-cancelled alert
  const handleAutoCancelledAlertClose = () => {
    setShowAutoCancelledAlert(false);
  };

  // Handle closing the missed appointment alert
  const handleMissedAlertClose = () => {
    setShowMissedAlert(false);
  };

  // Handle closing the upcoming appointment alert
  const handleUpcomingAlertClose = () => {
    setShowUpcomingAlert(false);
  };

  // Get status color for chips (add missed color)
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
  // const missedAppointments = appointments.filter(appointment => appointment.status === 'missed');

  // Redirect business users to the business dashboard
  if (user && user.role === 'business') {
    return <Navigate to="/business/booking-dashboard" />;
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Notification permission banner */}
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

      {/* Auto-cancelled appointments alert */}
      <Snackbar
        open={showAutoCancelledAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={10000}
        onClose={handleAutoCancelledAlertClose}
      >
        <Alert 
          severity="warning" 
          onClose={handleAutoCancelledAlertClose}
          sx={{ width: '100%' }}
        >
          {autoCancelledAppointments.length === 1 ? (
            <Typography variant="body2">
              Your appointment for {formatDate(autoCancelledAppointments[0].date)} at {autoCancelledAppointments[0].startTime} has been automatically marked as missed as the time has passed.
            </Typography>
          ) : (
            <Typography variant="body2">
              {autoCancelledAppointments.length} appointments have been automatically marked as missed as their scheduled times have passed.
            </Typography>
          )}
        </Alert>
      </Snackbar>

      {/* Missed appointments alert */}
      <Snackbar
        open={showMissedAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={10000}
        onClose={handleMissedAlertClose}
      >
        <Alert 
          severity="error" 
          onClose={handleMissedAlertClose}
          sx={{ width: '100%' }}
        >
          {missedAppointments.length === 1 ? (
            <Typography variant="body2">
              Your appointment for {formatDate(missedAppointments[0].date)} at {missedAppointments[0].startTime} has been marked as missed.
            </Typography>
          ) : (
            <Typography variant="body2">
              {missedAppointments.length} appointments have been marked as missed.
            </Typography>
          )}
        </Alert>
      </Snackbar>

      {/* Upcoming appointments reminder */}
      <Snackbar
        open={showUpcomingAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={30000}
        onClose={handleUpcomingAlertClose}
      >
        <Alert 
          severity="info" 
          onClose={handleUpcomingAlertClose}
          sx={{ width: '100%' }}
        >
          {upcomingAppointments.length === 1 ? (
            <Typography variant="body2">
              Reminder: Your appointment for {formatDate(upcomingAppointments[0].date)} at {upcomingAppointments[0].startTime} is coming up soon.
            </Typography>
          ) : (
            <Typography variant="body2">
              Reminder: You have {upcomingAppointments.length} appointments coming up soon.
            </Typography>
          )}
        </Alert>
      </Snackbar>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          My Dashboard
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton 
            color="primary" 
            onClick={handleNotificationClick} 
            sx={{ mr: 2 }}
            aria-label="notifications"
          >
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
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

      {/* Notifications Popover */}
      <Popover
        open={openNotifications}
        anchorEl={anchorEl}
        onClose={handleNotificationClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ width: 320, maxHeight: 400, overflow: 'auto' }}>
          <List>
            {notifications.length === 0 ? (
              <ListItem>
                <ListItemText primary="No notifications" />
              </ListItem>
            ) : (
              notifications.map((notification) => (
                <ListItem
                  key={notification.id}
                  button
                  component={notification.appointmentId ? RouterLink : 'div'}
                  to={notification.appointmentId ? `/appointments/${notification.appointmentId}` : undefined}
                  sx={{
                    borderLeft: `4px solid ${
                      notification.type === 'missed' ? '#f44336' : 
                      notification.type === 'auto-cancelled' ? '#ff9800' : 
                      notification.type === 'upcoming' ? '#2196f3' : 'transparent'
                    }`,
                  }}
                >
                  <ListItemText 
                    primary={notification.message} 
                    secondary={notification.time.toLocaleString()}
                    primaryTypographyProps={{
                      color: 
                        notification.type === 'missed' ? 'error' :
                        notification.type === 'auto-cancelled' ? 'warning' : 'primary'
                    }}
                  />
                </ListItem>
              ))
            )}
          </List>
        </Box>
      </Popover>

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

export default Dashboard; 