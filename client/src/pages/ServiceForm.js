import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Paper,
  CircularProgress,
  InputAdornment,
  FormControlLabel,
  Switch
} from '@mui/material';
import { toast } from 'react-toastify';

const ServiceForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: 60,
    price: 0,
    active: true
  });
  
  const [loading, setLoading] = useState(false);
  const [loadingService, setLoadingService] = useState(isEditing);
  const [error, setError] = useState('');
  
  const { name, description, duration, price, active } = formData;
  
  // Fetch service data if editing
  useEffect(() => {
    const fetchService = async () => {
      if (!isEditing) return;
      
      try {
        const res = await api.get(`/api/services/${id}`);
        setFormData({
          name: res.data.name,
          description: res.data.description,
          duration: res.data.duration,
          price: res.data.price,
          active: res.data.active
        });
      } catch (error) {
        console.error('Error fetching service:', error);
        setError('Failed to load service data');
        toast.error('Failed to load service data');
      } finally {
        setLoadingService(false);
      }
    };

    fetchService();
  }, [id, isEditing]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
    setError('');
  };
  
  const validateForm = () => {
    if (!name || !description || duration <= 0 || price < 0) {
      setError('Please fill in all required fields with valid values');
      return false;
    }
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const serviceData = {
        name,
        description,
        duration: Number(duration),
        price: Number(price),
        active
      };
      
      if (isEditing) {
        await api.put(`/api/services/${id}`, serviceData);
        toast.success('Service updated successfully');
      } else {
        await api.post('/api/services', serviceData);
        toast.success('Service created successfully');
      }
      
      navigate('/business/dashboard');
    } catch (error) {
      console.error('Error saving service:', error);
      setError('Failed to save service');
    } finally {
      setLoading(false);
    }
  };
  
  if (loadingService) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {isEditing ? 'Edit Service' : 'Add New Service'}
      </Typography>
      
      <Paper sx={{ p: 3, mt: 3 }}>
        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Service Name"
                value={name}
                onChange={handleChange}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="description"
                name="description"
                label="Description"
                multiline
                rows={4}
                value={description}
                onChange={handleChange}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="duration"
                name="duration"
                label="Duration"
                type="number"
                value={duration}
                onChange={handleChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">minutes</InputAdornment>,
                }}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="price"
                name="price"
                label="Price"
                type="number"
                value={price}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                required
              />
            </Grid>
            
            {isEditing && (
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={active}
                      onChange={handleChange}
                      name="active"
                      color="primary"
                    />
                  }
                  label="Active (visible to customers)"
                />
              </Grid>
            )}
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  type="button"
                  variant="outlined"
                  sx={{ mr: 1 }}
                  onClick={() => navigate('/business/dashboard')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : isEditing ? 'Update Service' : 'Add Service'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default ServiceForm; 