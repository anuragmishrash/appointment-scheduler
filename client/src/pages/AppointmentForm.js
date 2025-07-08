import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Divider,
  Card,
  CardContent
} from '@mui/material';
import { toast } from 'react-toastify';

const AppointmentForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    service: '',
    date: new Date(),
    timeSlot: '',
    notes: ''
  });
  
  const [businesses, setBusinesses] = useState([]);
  const [services, setServices] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingBusinesses, setLoadingBusinesses] = useState(true);
  const [loadingServices, setLoadingServices] = useState(false);
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch businesses (users with role 'business')
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        // In a real app, you'd have an endpoint to fetch businesses
        // For now, we'll use the seed data we created
        const response = await api.get('/api/auth/businesses');
        setBusinesses(response.data || []);
      } catch (error) {
        console.error('Error fetching businesses:', error);
        // Fallback to seed data if API endpoint doesn't exist
        const seedBusinesses = [
          { _id: '1', name: 'Hair & Style Salon' },
          { _id: '2', name: 'Dental Care' },
          { _id: '3', name: 'Fitness Center' }
        ];
        setBusinesses(seedBusinesses);
      } finally {
        setLoadingBusinesses(false);
      }
    };

    fetchBusinesses();
  }, []);

  // Fetch services when business is selected
  useEffect(() => {
    const fetchServices = async () => {
      if (!selectedBusiness) return;
      
      setLoadingServices(true);
      try {
        const res = await api.get(`/api/services/business/${selectedBusiness}`);
        setServices(res.data);
        
        // If no services are returned, create some mock services for testing
        if (!res.data || res.data.length === 0) {
          const mockServices = [
            { _id: '1', name: 'Haircut', price: 35, duration: 30 },
            { _id: '2', name: 'Hair Coloring', price: 85, duration: 90 },
            { _id: '3', name: 'Hair Styling', price: 55, duration: 60 }
          ];
          setServices(mockServices);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        // Create mock services for testing
        const mockServices = [
          { _id: '1', name: 'Haircut', price: 35, duration: 30 },
          { _id: '2', name: 'Hair Coloring', price: 85, duration: 90 },
          { _id: '3', name: 'Hair Styling', price: 55, duration: 60 }
        ];
        setServices(mockServices);
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, [selectedBusiness]);

  // Fetch available time slots when date and service are selected
  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!selectedBusiness || !formData.date) return;
      
      setLoadingTimeSlots(true);
      try {
        const formattedDate = formData.date.toISOString().split('T')[0];
        console.log(`Fetching time slots for business: ${selectedBusiness}, date: ${formattedDate}`);
        const res = await api.get(`/api/availability/slots/${selectedBusiness}/${formattedDate}`);
        
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
  }, [selectedBusiness, formData.date]);

  const handleBusinessChange = (e) => {
    setSelectedBusiness(e.target.value);
    setFormData({ ...formData, service: '' });
    setTimeSlots([]);
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, date, timeSlot: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!selectedBusiness) newErrors.business = 'Please select a business';
    if (!formData.service) newErrors.service = 'Please select a service';
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
        service: formData.service,
        date: formData.date.toISOString(),
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        notes: formData.notes
      };
      
      await api.post('/api/appointments', appointmentData);
      toast.success('Appointment booked successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error(error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Book an Appointment
      </Typography>
      
      <Paper sx={{ p: 3, mt: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.business}>
                <InputLabel id="business-select-label">Select Business</InputLabel>
                <Select
                  labelId="business-select-label"
                  id="business"
                  value={selectedBusiness}
                  label="Select Business"
                  onChange={handleBusinessChange}
                  disabled={loadingBusinesses}
                >
                  {businesses.map((business) => (
                    <MenuItem key={business._id} value={business._id}>
                      {business.name || business.businessDetails?.businessName || 'Business'}
                    </MenuItem>
                  ))}
                </Select>
                {errors.business && <FormHelperText>{errors.business}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.service} disabled={!selectedBusiness || loadingServices}>
                <InputLabel id="service-select-label">Select Service</InputLabel>
                <Select
                  labelId="service-select-label"
                  id="service"
                  name="service"
                  value={formData.service}
                  label="Select Service"
                  onChange={handleChange}
                >
                  {services.map((service) => (
                    <MenuItem key={service._id} value={service._id}>
                      {service.name} - ${service.price} ({service.duration} min)
                    </MenuItem>
                  ))}
                </Select>
                {errors.service && <FormHelperText>{errors.service}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Select Date & Time
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
                      disabled={!selectedBusiness}
                    />
                  }
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.timeSlot} disabled={!selectedBusiness || !formData.date || loadingTimeSlots}>
                <InputLabel id="time-slot-select-label">Select Time Slot</InputLabel>
                <Select
                  labelId="time-slot-select-label"
                  id="timeSlot"
                  name="timeSlot"
                  value={formData.timeSlot}
                  label="Select Time Slot"
                  onChange={handleChange}
                >
                  {timeSlots.length > 0 ? (
                    timeSlots.map((slot, index) => (
                    <MenuItem key={index} value={slot.startTime}>
                      {slot.startTime} - {slot.endTime}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled value="">
                      No available time slots for this date
                    </MenuItem>
                  )}
                </Select>
                {errors.timeSlot && <FormHelperText>{errors.timeSlot}</FormHelperText>}
                {!loadingTimeSlots && timeSlots.length === 0 && (
                  <FormHelperText error>No available time slots for this date. Please select another date.</FormHelperText>
                )}
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
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Book Appointment'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      
      {formData.service && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Appointment Summary
            </Typography>
            <Typography variant="body2">
              <strong>Business:</strong> {businesses.find(b => b._id === selectedBusiness)?.name}
            </Typography>
            <Typography variant="body2">
              <strong>Service:</strong> {services.find(s => s._id === formData.service)?.name}
            </Typography>
            <Typography variant="body2">
              <strong>Price:</strong> ${services.find(s => s._id === formData.service)?.price}
            </Typography>
            <Typography variant="body2">
              <strong>Duration:</strong> {services.find(s => s._id === formData.service)?.duration} minutes
            </Typography>
            {formData.timeSlot && (
              <>
                <Typography variant="body2">
                  <strong>Date:</strong> {formData.date.toLocaleDateString()}
                </Typography>
                <Typography variant="body2">
                  <strong>Time:</strong> {formData.timeSlot} - {timeSlots.find(slot => slot.startTime === formData.timeSlot)?.endTime}
                </Typography>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default AppointmentForm; 