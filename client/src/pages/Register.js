import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
  CircularProgress,
  Paper,
  MenuItem,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  Collapse,
  InputAdornment,
  IconButton
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    phone: '',
    address: '',
    businessName: '',
    businessDescription: '',
    businessCategory: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register, authError, clearAuthError } = useAuth();
  const navigate = useNavigate();
  
  const { 
    name, 
    email, 
    password, 
    confirmPassword, 
    role,
    phone,
    address,
    businessName,
    businessDescription,
    businessCategory
  } = formData;
  
  // Clear errors on mount
  useEffect(() => {
    setError('');
    clearAuthError();
  }, [clearAuthError]);
  
  // Update local error state when auth context error changes
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  
  const clearLocalStorage = () => {
    console.log('Clearing all auth-related localStorage data');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    
    // Clear any other potential cached auth data
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('token') || key.includes('user') || key.includes('auth'))) {
        console.log(`Removing potential auth-related item: ${key}`);
        localStorage.removeItem(key);
      }
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    // Additional validation for business users
    if (role === 'business' && (!businessName || !businessCategory)) {
      setError('Please fill in all required business fields');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Clear any existing tokens before registration
      clearLocalStorage();
      
      // Prepare registration data - ensure all required fields are explicitly set
      const userData = {
        name: name.trim(),
        email: email.trim(),
        password,
        role: role || 'user',
      };
      
      // Only add fields if they have values
      if (phone && phone.trim() !== '') userData.phone = phone.trim();
      if (address && address.trim() !== '') userData.address = address.trim();
      
      // Add business details if registering as a business
      if (role === 'business') {
        userData.businessDetails = {
          businessName: businessName.trim(),
          description: businessDescription?.trim() || '',
          category: businessCategory.trim()
        };
      }
      
      console.log('Submitting registration with data:', {
        ...userData,
        password: '[REDACTED]'
      });
      
      // Try registration with a small delay to ensure storage is cleared
      setTimeout(async () => {
        try {
          const success = await register(userData);
          if (success) {
            if (role === 'business') {
              navigate('/business/dashboard');
            } else {
              navigate('/dashboard');
            }
          } else {
            // If registration failed but no error was set in auth context
            if (!authError) {
              setError('Registration failed. Please check your information and try again.');
            }
          }
        } catch (regError) {
          console.error('Registration error caught:', regError);
          
          if (regError.message && regError.message.includes('Network Error')) {
            setError(
              'Cannot connect to server. Please check if the server is running and your internet connection is stable.'
            );
            
            // Show more helpful information in development
            if (process.env.NODE_ENV === 'development') {
              setError(
                'Cannot connect to server at http://localhost:5000. Please make sure your backend server is running (cd server && npm start).'
              );
            }
          } else {
            setError('Connection error. Please check your network and try again.');
          }
        }
        setLoading(false);
      }, 300);
    } catch (error) {
      console.error('Error during registration:', error);
      setError('Registration failed. Please try again later.');
      setLoading(false);
    }
  };
  
  return (
    <Container component="main" maxWidth="sm">
      <Paper 
        elevation={3} 
        sx={{ 
          mt: 8, 
          p: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center' 
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <PersonAddIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        
        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="role-select-label">Account Type</InputLabel>
                <Select
                  labelId="role-select-label"
                  id="role"
                  name="role"
                  value={role}
                  label="Account Type"
                  onChange={handleChange}
                >
                  <MenuItem value="user">Customer</MenuItem>
                  <MenuItem value="business">Business</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="name"
                name="name"
                required
                fullWidth
                id="name"
                label="Full Name"
                autoFocus
                value={name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={toggleShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={toggleShowConfirmPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="phone"
                label="Phone Number"
                id="phone"
                value={phone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="address"
                label="Address"
                id="address"
                value={address}
                onChange={handleChange}
              />
            </Grid>
            
            {/* Business Information (only shown if role is business) */}
            <Collapse in={role === 'business'} sx={{ width: '100%' }}>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Business Information
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required={role === 'business'}
                    fullWidth
                    name="businessName"
                    label="Business Name"
                    id="businessName"
                    value={businessName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required={role === 'business'}
                    fullWidth
                    name="businessCategory"
                    label="Business Category"
                    id="businessCategory"
                    value={businessCategory}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="businessDescription"
                    label="Business Description"
                    id="businessDescription"
                    multiline
                    rows={3}
                    value={businessDescription}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </Collapse>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign Up'}
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link component={RouterLink} to="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register; 