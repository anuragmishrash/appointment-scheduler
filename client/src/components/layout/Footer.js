import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Grid,
  Link,
  Typography,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
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
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const currentYear = new Date().getFullYear();
  
  const linkStyle = {
    color: 'text.secondary',
    textDecoration: 'none',
    transition: 'color 0.2s ease',
    '&:hover': {
      color: theme.palette.primary.main,
      textDecoration: 'none',
    },
    display: 'block',
    mb: 1
  };

  // Social media links
  const instagramLink = "https://www.instagram.com/its_anurag.m?igsh=MWwwZHNjbTkzMml6Zw==";
  const linkedinLink = "https://www.linkedin.com/in/anurag-mishra-218b94252?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app";
  const githubLink = "https://github.com/anuragmishrash";

  return (
    <Box 
      component="footer"
      sx={{
        backgroundColor: theme.palette.mode === 'dark' ? 'background.paper' : '#f5f5f5',
        py: isMobile ? 4 : 6,
        position: 'relative',
        overflow: 'hidden',
        zIndex: 1,
        borderTop: `1px solid ${theme.palette.divider}`,
        mt: 'auto',
      }}
    >
      {/* Background decoration */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          background: theme.palette.primary.main,
          opacity: 0.03,
          borderRadius: '50%',
          zIndex: -1,
        }}
      />
      <Container maxWidth="lg">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
        >
          <Grid container spacing={4}>
            {/* Logo and about */}
            <Grid item xs={12} md={5}>
              <motion.div variants={itemVariants}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EventAvailableIcon
                    sx={{
                      mr: 1,
                      color: theme.palette.primary.main,
                      fontSize: 32,
                    }}
                  />
                  <Typography
                    variant="h6"
                    component="span"
                    sx={{
                      fontWeight: 700,
                      letterSpacing: '.1rem',
                      background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    SCHEDULER
                  </Typography>
                </Box>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: '90%' }}>
                  Streamline your scheduling process with our easy-to-use appointment booking system. Perfect for businesses and individuals.
                </Typography>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    size="small"
                    aria-label="instagram"
                    href={instagramLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                      transition: 'all 0.3s',
                      '&:hover': {
                        background: theme.palette.primary.main,
                        color: 'white',
                        transform: 'translateY(-3px)',
                      }
                    }}
                  >
                    <InstagramIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    aria-label="linkedin"
                    href={linkedinLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                      transition: 'all 0.3s',
                      '&:hover': {
                        background: theme.palette.primary.main,
                        color: 'white',
                        transform: 'translateY(-3px)',
                      }
                    }}
                  >
                    <LinkedInIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    aria-label="github"
                    href={githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                      transition: 'all 0.3s',
                      '&:hover': {
                        background: theme.palette.primary.main,
                        color: 'white',
                        transform: 'translateY(-3px)',
                      }
                    }}
                  >
                    <GitHubIcon fontSize="small" />
                  </IconButton>
                </Box>
              </motion.div>
            </Grid>
            
            {/* Quick Links */}
            <Grid item xs={6} md={3.5}>
              <motion.div variants={itemVariants}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Quick Links
                </Typography>
                <Link component={RouterLink} to="/" sx={linkStyle}>
                  Home
                </Link>
                <Link component={RouterLink} to="/dashboard" sx={linkStyle}>
                  Dashboard
                </Link>
                <Link component={RouterLink} to="/calendar" sx={linkStyle}>
                  Calendar
                </Link>
                <Link component={RouterLink} to="/profile" sx={linkStyle}>
                  Profile
                </Link>
              </motion.div>
            </Grid>
            
            {/* For Business */}
            <Grid item xs={6} md={3.5}>
              <motion.div variants={itemVariants}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  For Business
                </Typography>
                <Link component={RouterLink} to="/business/dashboard" sx={linkStyle}>
                  Business Dashboard
                </Link>
                <Link component={RouterLink} to="/services/new" sx={linkStyle}>
                  Add Service
                </Link>
                <Link component={RouterLink} to="/availability" sx={linkStyle}>
                  Set Availability
                </Link>
                <Link component={RouterLink} to="/business/booking-dashboard" sx={linkStyle}>
                  My Bookings
                </Link>
              </motion.div>
            </Grid>
          </Grid>
          
          <motion.div variants={itemVariants}>
            <Divider sx={{ my: 3 }} />
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              flexDirection: isMobile ? 'column' : 'row',
              gap: isMobile ? 1 : 0
            }}>
              <Typography variant="body2" color="text.secondary" align={isMobile ? 'center' : 'left'}>
                © {currentYear} Appointment Scheduler. All rights reserved.
              </Typography>
              <Typography variant="body2" color="text.secondary" align={isMobile ? 'center' : 'right'}>
                Made with ❤️ for Better Scheduling
              </Typography>
            </Box>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Footer; 