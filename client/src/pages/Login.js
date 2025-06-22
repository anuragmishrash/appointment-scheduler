import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import {
  Avatar,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  Paper,
  useTheme,
  useMediaQuery,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import KeyIcon from '@mui/icons-material/Key';
import { showToast } from '../components/common/CustomToast';
import CustomLoader from '../components/common/CustomLoader';
import RippleButton from '../components/common/RippleButton';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: '20px',
  backdropFilter: 'blur(10px)',
  background: theme.palette.mode === 'dark'
    ? 'rgba(30, 30, 30, 0.8)'
    : 'rgba(255, 255, 255, 0.9)',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 15px 35px rgba(0, 0, 0, 0.4)'
    : '0 15px 35px rgba(0, 0, 0, 0.1)',
  border: `1px solid ${theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.05)'
    }`,
  padding: theme.spacing(4),
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease',

  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '5px',
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  },

  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3, 2),
    borderRadius: '15px',
    margin: theme.spacing(0, 1),
  }
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  margin: theme.spacing(1),
  backgroundColor: 'transparent',
  width: 60,
  height: 60,
  boxShadow: theme.shadows[3],
  border: `2px solid ${theme.palette.primary.main}`,
  color: theme.palette.primary.main,
  background: theme.palette.mode === 'dark'
    ? 'rgba(50, 50, 50, 0.8)'
    : 'rgba(255, 255, 255, 0.9)',
  transform: 'translateZ(50px)',
  transition: 'all 0.3s ease',

  '& .MuiSvgIcon-root': {
    fontSize: '2rem',
  }
}));

const FormContainer = styled(Box)(({ theme }) => ({
  perspective: '1000px',
  transformStyle: 'preserve-3d',
  marginTop: theme.spacing(1),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    background: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(0, 0, 0, 0.02)',
    transition: 'all 0.3s ease',

    '&:hover': {
      background: theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.1)'
        : 'rgba(0, 0, 0, 0.04)',
    },

    '&.Mui-focused': {
      background: theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.15)'
        : 'rgba(0, 0, 0, 0.05)',
      boxShadow: `0 0 0 2px ${theme.palette.primary.main}20`,
    },
  },
}));

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
      delayChildren: 0.2,
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
};

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { email, password } = formData;
  
  useEffect(() => {
    // Clear any previous errors when component mounts
    setError('');
  }, []);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        showToast.success('Login successful! Welcome back.');
        navigate('/dashboard');
      }
    } catch (error) {
      setError('Login failed. Please check your credentials.');
      showToast.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container component="main" maxWidth="xs">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        style={{
          marginTop: '8vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <StyledPaper elevation={6}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <motion.div variants={itemVariants}>
              <StyledAvatar>
                <LockOutlinedIcon fontSize="large" />
              </StyledAvatar>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Typography 
                component="h1" 
                variant={isMobile ? "h5" : "h4"}
                sx={{ 
                  fontWeight: 700,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1
                }}
              >
                Sign in
              </Typography>
            </motion.div>
            
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Typography color="error" variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                  {error}
                </Typography>
              </motion.div>
            )}
            
            <FormContainer component="form" onSubmit={handleSubmit} noValidate>
              <motion.div variants={itemVariants}>
                <StyledTextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <StyledTextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <KeyIcon color="primary" />
                      </InputAdornment>
                    ),
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
              </motion.div>
              
              <motion.div variants={itemVariants} style={{ width: '100%' }}>
                <Box sx={{ position: 'relative', mt: 3, mb: 2, height: 50 }}>
                  {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <CustomLoader text="" />
                    </Box>
                  ) : (
                    <RippleButton
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      disabled={loading}
                      style={{ height: '50px', fontSize: '1rem' }}
                    >
                      Sign In
                    </RippleButton>
                  )}
                </Box>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Grid container spacing={2} alignItems="center" sx={{ mt: 2, mb: 1 }}>
                  <Grid item xs={5}>
                    <Divider />
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="body2" color="text.secondary" align="center">
                      Or
                    </Typography>
                  </Grid>
                  <Grid item xs={5}>
                    <Divider />
                  </Grid>
                </Grid>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Grid container justifyContent="center" sx={{ mt: 2 }}>
                  <Grid item>
                    <Link
                      component={RouterLink}
                      to="/register"
                      variant="body1"
                      sx={{
                        fontWeight: 500,
                        position: 'relative',
                        display: 'inline-block',
                        color: theme.palette.primary.main,
                        textDecoration: 'none',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          width: '100%',
                          transform: 'scaleX(0)',
                          height: '2px',
                          bottom: -2,
                          left: 0,
                          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                          transformOrigin: 'bottom right',
                          transition: 'transform 0.3s ease-out'
                        },
                        '&:hover::after': {
                          transform: 'scaleX(1)',
                          transformOrigin: 'bottom left'
                        }
                      }}
                    >
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
              </motion.div>
            </FormContainer>
          </Box>
        </StyledPaper>
        
        <motion.div variants={itemVariants}>
          <Typography
            variant="caption"
            color="text.secondary"
            align="center"
            sx={{ mt: 5, display: 'block', opacity: 0.7 }}
          >
            &copy; {new Date().getFullYear()} Appointment Scheduler. All rights reserved.
          </Typography>
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default Login; 