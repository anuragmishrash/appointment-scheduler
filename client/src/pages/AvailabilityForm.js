import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Typography,
  Box,
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  IconButton
} from '@mui/material';
import { toast } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const AvailabilityForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    dayOfWeek: 1, // Monday
    startTime: '09:00',
    endTime: '17:00',
    isAvailable: true,
    specificDate: null
  });
  
  const [availabilityList, setAvailabilityList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingAvailability, setLoadingAvailability] = useState(true);
  const [error, setError] = useState('');
  
  const { dayOfWeek, startTime, endTime, specificDate } = formData;
  
  // Days of the week
  const daysOfWeek = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' }
  ];
  
  // Fetch availability data
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await api.get(`/api/availability/${user._id}`);
        setAvailabilityList(res.data);
      } catch (error) {
        console.error('Error fetching availability:', error);
        setError('Failed to load availability data');
        toast.error('Failed to load availability data');
      } finally {
        setLoadingAvailability(false);
      }
    };

    fetchAvailability();
  }, [user._id]);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };
  
  const handleDateChange = (date) => {
    setFormData({ ...formData, specificDate: date });
  };
  
  const validateForm = () => {
    if (!startTime || !endTime) {
      setError('Please fill in all required fields');
      return false;
    }
    
    if (startTime >= endTime) {
      setError('Start time must be before end time');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const availabilityData = {
        dayOfWeek,
        startTime,
        endTime,
        isAvailable: true,
        specificDate: specificDate ? specificDate.toISOString() : null
      };
      
      const res = await api.post('/api/availability', availabilityData);
      
      // Update the list with the new availability
      setAvailabilityList([...availabilityList, res.data]);
      
      // Reset form
      setFormData({
        dayOfWeek: 1,
        startTime: '09:00',
        endTime: '17:00',
        isAvailable: true,
        specificDate: null
      });
      
      toast.success('Availability added successfully');
    } catch (error) {
      console.error('Error saving availability:', error);
      setError('Failed to save availability');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/availability/${id}`);
      setAvailabilityList(availabilityList.filter(item => item._id !== id));
      toast.success('Availability removed successfully');
    } catch (error) {
      console.error('Error deleting availability:', error);
      toast.error('Failed to delete availability');
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return null;
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Group availability by day of week
  const groupedAvailability = availabilityList.reduce((acc, item) => {
    // If it's a specific date, put it in its own category
    if (item.specificDate) {
      if (!acc.specificDates) {
        acc.specificDates = [];
      }
      acc.specificDates.push(item);
      return acc;
    }
    
    // Otherwise group by day of week
    const day = item.dayOfWeek;
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(item);
    return acc;
  }, {});
  
  if (loadingAvailability) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Manage Availability
      </Typography>
      
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Add New Availability
        </Typography>
        
        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="day-of-week-label">Day of Week</InputLabel>
                <Select
                  labelId="day-of-week-label"
                  id="dayOfWeek"
                  name="dayOfWeek"
                  value={dayOfWeek}
                  label="Day of Week"
                  onChange={handleChange}
                >
                  {daysOfWeek.map((day) => (
                    <MenuItem key={day.value} value={day.value}>
                      {day.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Specific Date (Optional):
                </Typography>
                <DatePicker
                  selected={specificDate}
                  onChange={handleDateChange}
                  dateFormat="MMMM d, yyyy"
                  className="form-control"
                  wrapperClassName="w-100"
                  placeholderText="Click to select a date"
                  isClearable
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="startTime"
                name="startTime"
                label="Start Time (HH:MM)"
                type="time"
                value={startTime}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 300, // 5 min
                }}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="endTime"
                name="endTime"
                label="End Time (HH:MM)"
                type="time"
                value={endTime}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 300, // 5 min
                }}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<AddIcon />}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Add Availability'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Current Availability
        </Typography>
        
        {/* Regular weekly availability */}
        {daysOfWeek.map((day) => {
          const dayAvailability = groupedAvailability[day.value] || [];
          
          if (dayAvailability.length === 0) return null;
          
          return (
            <Paper key={day.value} sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                {day.label}
              </Typography>
              
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Start Time</TableCell>
                      <TableCell>End Time</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dayAvailability.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell>{item.startTime}</TableCell>
                        <TableCell>{item.endTime}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(item._id)}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          );
        })}
        
        {/* Specific dates */}
        {groupedAvailability.specificDates && groupedAvailability.specificDates.length > 0 && (
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Specific Dates
            </Typography>
            
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Start Time</TableCell>
                    <TableCell>End Time</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {groupedAvailability.specificDates.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>{formatDate(item.specificDate)}</TableCell>
                      <TableCell>{item.startTime}</TableCell>
                      <TableCell>{item.endTime}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(item._id)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
        
        {Object.keys(groupedAvailability).length === 0 && (
          <Paper sx={{ p: 2, mb: 4 }}>
            <Typography variant="body1" align="center">
              You haven't set any availability yet.
            </Typography>
          </Paper>
        )}
      </Box>
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/business/dashboard')}
        >
          Back to Dashboard
        </Button>
      </Box>
    </Box>
  );
};

export default AvailabilityForm; 