import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
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
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert
} from '@mui/material';
import { toast } from 'react-toastify';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import EventIcon from '@mui/icons-material/Event';

const BusinessDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [appointmentTabValue, setAppointmentTabValue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch appointments
        const appointmentsRes = await api.get('/api/appointments');
        
        // Filter to only show appointments where this business is the provider
        const businessAppointments = appointmentsRes.data.filter(
          appointment => appointment.isBusinessAppointment
        );
        
        setAppointments(businessAppointments);
        
        // Fetch services
        const servicesRes = await api.get(`/api/services/business/${user._id}`);
        setServices(servicesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user._id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAppointmentTabChange = (event, newValue) => {
    setAppointmentTabValue(newValue);
  };

  const handleUpdateAppointmentStatus = async (id, status) => {
    try {
      // Send the status update to the server
      await api.put(`/api/appointments/${id}`, { status });
      
      // Update the local state to reflect the change immediately
      setAppointments(appointments.map(appointment => 
        appointment._id === id 
          ? { ...appointment, status } 
          : appointment
      ));
      
      toast.success(`Appointment ${status === 'completed' ? 'marked as complete' : 'cancelled'}`);
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error(error.response?.data?.message || 'Failed to update appointment');
    }
  };

  // Get status color for chip
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
      default:
        return 'default';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Filter appointments by status
  const allAppointments = appointments;
  const scheduledAppointments = appointments.filter(
    appointment => appointment.status === 'scheduled'
  );
  const cancelledAppointments = appointments.filter(
    appointment => appointment.status === 'cancelled'
  );
  const completedAppointments = appointments.filter(
    appointment => appointment.status === 'completed'
  );

  // Get displayed appointments based on selected tab
  const getDisplayedAppointments = () => {
    switch(appointmentTabValue) {
      case 0: return allAppointments;
      case 1: return scheduledAppointments;
      case 2: return cancelledAppointments;
      case 3: return completedAppointments;
      default: return allAppointments;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1">
            Business Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {user?.businessDetails?.businessName || user?.name}
          </Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<SettingsIcon />}
            component={RouterLink}
            to="/availability"
            sx={{ mr: 1 }}
          >
            Manage Availability
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            component={RouterLink}
            to="/services/new"
          >
            Add Service
          </Button>
        </Box>
      </Box>

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Appointments" />
        <Tab label="Services" />
      </Tabs>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {/* Appointments Tab */}
      {tabValue === 0 && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Appointments
            </Typography>
            <Button
              variant="outlined"
              component={RouterLink}
              to="/business/booking-dashboard"
              startIcon={<EventIcon />}
              size="small"
            >
              View My Bookings
            </Button>
          </Box>
          
          <Tabs 
            value={appointmentTabValue} 
            onChange={handleAppointmentTabChange} 
            sx={{ mb: 2 }}
            variant="fullWidth"
          >
            <Tab label={`All (${allAppointments.length})`} />
            <Tab label={`Scheduled (${scheduledAppointments.length})`} />
            <Tab label={`Cancelled (${cancelledAppointments.length})`} />
            <Tab label={`Completed (${completedAppointments.length})`} />
          </Tabs>
          
          {getDisplayedAppointments().length === 0 ? (
            <Alert severity="info" sx={{ mb: 4 }}>
              No appointments found in this category.
            </Alert>
          ) : (
            <TableContainer component={Paper} sx={{ mb: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Customer</TableCell>
                    <TableCell>Service</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getDisplayedAppointments().map((appointment) => (
                    <TableRow key={appointment._id}>
                      <TableCell>{appointment.user?.name || 'Customer'}</TableCell>
                      <TableCell>{appointment.service?.name || 'Service'}</TableCell>
                      <TableCell>{formatDate(appointment.date)}</TableCell>
                      <TableCell>{appointment.startTime} - {appointment.endTime}</TableCell>
                      <TableCell>
                        <Chip
                          label={appointment.status}
                          color={getStatusColor(appointment.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {appointment.status === 'scheduled' && (
                          <>
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              onClick={() => handleUpdateAppointmentStatus(appointment._id, 'completed')}
                              sx={{ mr: 1 }}
                            >
                              Complete
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              color="error"
                              onClick={() => handleUpdateAppointmentStatus(appointment._id, 'cancelled')}
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                        {appointment.status === 'completed' && (
                          <Chip label="Completed" color="success" size="small" />
                        )}
                        {appointment.status === 'cancelled' && (
                          <Chip label="Cancelled" color="error" size="small" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}

      {/* Services Tab */}
      {tabValue === 1 && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Your Services
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              component={RouterLink}
              to="/services/new"
              size="small"
            >
              Add New Service
            </Button>
          </Box>
          
          {services.length === 0 ? (
            <Card sx={{ mb: 4, p: 2 }}>
              <CardContent>
                <Typography variant="body1" align="center">
                  You haven't added any services yet.
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Button
                    variant="contained"
                    component={RouterLink}
                    to="/services/new"
                    startIcon={<AddIcon />}
                  >
                    Add Your First Service
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Grid container spacing={3}>
              {services.map((service) => (
                <Grid item xs={12} sm={6} md={4} key={service._id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="div" gutterBottom>
                        {service.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {service.description}
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body1">
                          Price: ${service.price}
                        </Typography>
                        <Typography variant="body2">
                          Duration: {service.duration} minutes
                        </Typography>
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        component={RouterLink}
                        to={`/services/edit/${service._id}`}
                      >
                        Edit
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </Box>
  );
};

export default BusinessDashboard; 