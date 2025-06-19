import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import api from '../api/axios';
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  CircularProgress,
  FormHelperText,
  Card,
  CardContent,
  Alert
} from '@mui/material';
import { toast } from 'react-toastify';

const RescheduleAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: new Date(),
    timeSlot: '',
    notes: ''
  });
  
  const [originalAppointment, setOriginalAppointment] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingAppointment, setLoadingAppointment] = useState(true);
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch the original appointment
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await api.get(`/api/appointments/${id}`);
        setOriginalAppointment(response.data);
        
        // Pre-populate notes from the original appointment
        setFormData(prev => ({
          ...prev,
          notes: response.data.notes || ''
        }));
        
        setLoadingAppointment(false);
      } catch (err) {
        console.error('Error fetching appointment details:', err);
        toast.error('Failed to load appointment details');
        navigate('/dashboard');
      }
    };

    fetchAppointment();
  }, [id, navigate]);

  // Fetch available time slots when date changes
  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!originalAppointment || !formData.date) return;
      
      setLoadingTimeSlots(true);
      try {
        const formattedDate = formData.date.toISOString().split('T')[0];
        console.log(`Fetching time slots for business: ${originalAppointment.business._id}, date: ${formattedDate}`);
        const res = await api.get(`/api/availability/slots/${originalAppointment.business._id}/${formattedDate}`);
        
        if (res.data && Array.isArray(res.data)) {
          console.log(`Received ${res.data.length} time slots from server`);
          setTimeSlots(res.data);
        } else {
          console.log('No time slots returned from server');
          setTimeSlots([]);
        }
      } catch (error) {
        console.error('Error fetching time slots:', error);
        toast.error('Failed to load available time slots. Please try again.');
        setTimeSlots([]);
      } finally {
        setLoadingTimeSlots(false);
      }
    };

    fetchTimeSlots();
  }, [originalAppointment, formData.date]);

  const handleDateChange = (date) => {
    setFormData({ ...formData, date, timeSlot: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.timeSlot) newErrors.timeSlot = 'Please select a time slot';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const selectedSlot = timeSlots.find(slot => slot.startTime === formData.timeSlot);
      
      if (!selectedSlot) {
        throw new Error('Selected time slot not found');
      }
      
      const appointmentData = {
        date: formData.date.toISOString(),
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        notes: formData.notes,
        status: 'scheduled'
      };
      
      await api.put(`/api/appointments/${id}`, appointmentData);
      toast.success('Appointment rescheduled successfully!');
      navigate(`/appointments/${id}`);
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      toast.error(error.response?.data?.message || 'Failed to reschedule appointment');
    } finally {
      setLoading(false);
    }
  };

  if (loadingAppointment) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!originalAppointment) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="error">Appointment not found</Alert>
        <Button 
          variant="contained" 
          sx={{ mt: 2 }} 
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Reschedule Appointment
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Current Appointment Details
          </Typography>
          <Typography variant="body1">
            <strong>Service:</strong> {originalAppointment.service?.name}
          </Typography>
          <Typography variant="body1">
            <strong>Business:</strong> {originalAppointment.business?.name}
          </Typography>
          <Typography variant="body1">
            <strong>Date:</strong> {new Date(originalAppointment.date).toLocaleDateString()}
          </Typography>
          <Typography variant="body1">
            <strong>Time:</strong> {originalAppointment.startTime} - {originalAppointment.endTime}
          </Typography>
        </CardContent>
      </Card>
      
      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Select New Date & Time
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Select Date:
                </Typography>
                <DatePicker
                  selected={formData.date}
                  onChange={handleDateChange}
                  minDate={new Date()}
                  dateFormat="MMMM d, yyyy"
                  className="form-control"
                  wrapperClassName="w-100"
                  customInput={
                    <TextField 
                      fullWidth
                      variant="outlined"
                    />
                  }
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.timeSlot} disabled={!formData.date || loadingTimeSlots}>
                <InputLabel id="time-slot-select-label">Select Time Slot</InputLabel>
                <Select
                  labelId="time-slot-select-label"
                  id="timeSlot"
                  name="timeSlot"
                  value={formData.timeSlot}
                  label="Select Time Slot"
                  onChange={handleChange}
                >
                  {timeSlots.map((slot, index) => (
                    <MenuItem key={index} value={slot.startTime}>
                      {slot.startTime} - {slot.endTime}
                    </MenuItem>
                  ))}
                </Select>
                {errors.timeSlot && <FormHelperText>{errors.timeSlot}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="notes"
                name="notes"
                label="Additional Notes"
                multiline
                rows={4}
                value={formData.notes}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/appointments/${id}`)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Reschedule Appointment'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default RescheduleAppointment; 