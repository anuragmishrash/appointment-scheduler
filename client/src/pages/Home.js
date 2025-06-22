import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Box, 
  Grid, 
  Typography, 
  useTheme,
  useMediaQuery,
  styled
} from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Card3D from '../components/common/Card3D';
import RippleButton from '../components/common/RippleButton';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
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
      damping: 15,
      stiffness: 100,
    }
  }
};

const floatingAnimation = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut"
    }
  }
};

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(10, 2),
  overflow: 'hidden',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)'
    : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
  borderRadius: '0 0 30% 30% / 15%',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(6, 2),
  }
}));

const GradientText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  WebkitTextFillColor: 'transparent',
  textShadow: theme.palette.mode === 'dark'
    ? '0 5px 15px rgba(0,0,0,0.5)'
    : '0 5px 15px rgba(0,0,0,0.1)',
  display: 'inline-block',
  width: '100%',
  letterSpacing: '0.01em',
}));

// Page component
const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate('/register');
  };
  
  const handleSignIn = () => {
    navigate('/login');
  };
  
  const handleCalendarClick = () => {
    navigate('/calendar');
  };
  
  return (
    <>
      {/* Hero Section */}
      <HeroSection>
        <Box maxWidth="lg" sx={{ mx: 'auto' }}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={7}>
                <motion.div variants={itemVariants}>
                  <Typography
                    variant={isMobile ? "h3" : "h1"}
                    component="h1"
                    sx={{ 
                      mb: 2,
                      fontWeight: 800,
                      lineHeight: 1.2,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    Simplify Your 
                    <Box component="span" sx={{ display: 'block' }}>
                      <GradientText>
                        Appointment Scheduling
                      </GradientText>
                    </Box>
                  </Typography>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Typography 
                    variant="h6" 
                    color="text.secondary" 
                    paragraph 
                    sx={{ 
                      mb: 4,
                      maxWidth: '90%',
                      lineHeight: 1.7,
                      fontSize: isMobile ? '1rem' : '1.25rem',
                    }}
                  >
                    Streamline your appointment booking process. Easy to use for both businesses and customers.
                    Book appointments, manage your schedule, and receive reminders all in one place.
                  </Typography>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 2,
                      mb: 4
                    }}
                  >
                    <RippleButton
                      onClick={handleGetStarted}
                      variant="contained"
                      color="primary"
                      endIcon={<ArrowForwardIcon />}
                      style={{ 
                        paddingLeft: '28px',
                        paddingRight: '28px',
                        fontSize: isMobile ? '0.9rem' : '1rem',
                      }}
                    >
                      Get Started Now
                    </RippleButton>
                    
                    <RippleButton
                      onClick={handleSignIn}
                      variant="outlined"
                      color="primary"
                      style={{ 
                        paddingLeft: '28px',
                        paddingRight: '28px',
                        fontSize: isMobile ? '0.9rem' : '1rem',
                      }}
                    >
                      Sign In
                    </RippleButton>
                  </Box>
                </motion.div>
                
                {!isMobile && (
                  <motion.div variants={itemVariants}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      gap: 1.5,
                      mt: 3,
                      color: 'text.secondary',
                      fontSize: '0.875rem'
                    }}>
                      <Typography variant="body2" fontWeight={500}>Trusted by businesses worldwide</Typography>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        {[1, 2, 3].map((i) => (
                          <Box 
                            key={i}
                            sx={{ 
                              width: 8, 
                              height: 8, 
                              borderRadius: '50%',
                              background: theme.palette.primary.main,
                              opacity: 1 - (i * 0.2)
                            }} 
                          />
                        ))}
                      </Box>
                    </Box>
                  </motion.div>
                )}
              </Grid>
              
              <Grid item xs={12} md={5}>
                <motion.div 
                  variants={itemVariants}
                  style={{ 
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                  }}
                >
                  <Box sx={{ 
                    width: '100%',
                    height: isMobile ? '300px' : '400px',
                    position: 'relative',
                    perspective: '1000px',
                  }}>
                    {/* Decorative floating elements */}
                    <motion.div
                      style={{
                        position: 'absolute',
                        top: '10%',
                        left: '20%',
                        zIndex: 1,
                      }}
                      variants={floatingAnimation}
                      animate="animate"
                    >
                      <Box sx={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        background: theme.palette.primary.main,
                        opacity: 0.1,
                        filter: 'blur(8px)',
                      }} />
                    </motion.div>
                    
                    <motion.div
                      style={{
                        position: 'absolute',
                        bottom: '15%',
                        right: '15%',
                        zIndex: 1,
                      }}
                      variants={floatingAnimation}
                      animate={{
                        y: [0, -15, 0],
                        transition: {
                          delay: 1,
                          duration: 6,
                          repeat: Infinity,
                          repeatType: "mirror",
                          ease: "easeInOut"
                        }
                      }}
                    >
                      <Box sx={{
                        width: 70,
                        height: 70,
                        borderRadius: '50%',
                        background: theme.palette.secondary.main,
                        opacity: 0.1,
                        filter: 'blur(15px)',
                      }} />
                    </motion.div>
                    
                    {/* Main calendar illustration */}
                    <motion.div
                      onClick={handleCalendarClick}
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80%',
                        maxWidth: 350,
                        cursor: 'pointer',
                      }}
                      animate={{ 
                        y: [0, -10, 0],
                        rotateY: [0, 5, 0, -5, 0],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut"
                      }}
                      whileHover={{ 
                        scale: 1.05,
                        transition: { duration: 0.3 }
                      }}
                    >
                      <Card3D 
                        elevation={4} 
                        hoverEffect={true}
                        style={{
                          borderRadius: 20,
                          background: theme.palette.mode === 'dark'
                            ? 'linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%)'
                            : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                          overflow: 'hidden',
                          padding: 0,
                        }}
                      >
                        <Box sx={{ 
                          p: 3,
                          background: theme.palette.primary.main,
                          color: 'white',
                          borderRadius: '20px 20px 0 0',
                        }}>
                          <Typography variant="h6" fontWeight={600}>
                            Appointment Calendar
                          </Typography>
                        </Box>
                        <Box sx={{ p: 3 }}>
                          <Grid container spacing={1}>
                            {Array.from({ length: 31 }).map((_, i) => (
                              <Grid item xs={2} key={i}>
                                <Box sx={{ 
                                  p: 1.5,
                                  borderRadius: 1,
                                  textAlign: 'center',
                                  background: i === 15 ? theme.palette.primary.main : 'transparent',
                                  color: i === 15 ? 'white' : 'inherit',
                                  border: i === 15 ? 'none' : `1px solid ${theme.palette.divider}`,
                                }}>
                                  {i + 1}
                                </Box>
                              </Grid>
                            ))}
                          </Grid>
                          <Box sx={{ mt: 3, p: 2, background: theme.palette.action.hover, borderRadius: 2 }}>
                            <Typography variant="body2" fontWeight={500}>
                              Today's Appointments
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                              <Box sx={{ 
                                width: 10, 
                                height: 10, 
                                borderRadius: '50%',
                                background: theme.palette.success.main
                              }} />
                              <Typography variant="body2" color="text.secondary">
                                Meeting with John - 3:00 PM
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Card3D>
                    </motion.div>
                  </Box>
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        </Box>
      </HeroSection>

      {/* Features Section */}
      <Box maxWidth="lg" sx={{ py: 8, mx: 'auto', px: 2 }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <Typography 
              variant={isMobile ? "h4" : "h3"}
              component="h2"
              align="center"
              fontWeight={700}
              gutterBottom
              sx={{ mb: 1 }}
            >
              Key Features
            </Typography>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Typography 
              variant="h6" 
              align="center" 
              color="text.secondary" 
              paragraph
              sx={{ 
                mb: 6,
                maxWidth: 700,
                mx: 'auto',
                fontSize: isMobile ? '1rem' : '1.1rem',
              }}
            >
              Our platform offers everything you need to manage appointments efficiently
            </Typography>
          </motion.div>

          <Grid container spacing={isMobile ? 3 : 4}>
            <Grid item xs={12} md={4}>
              <motion.div variants={itemVariants}>
                <Card3D tiltEffect={!isMobile}>
                  <Box sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: 80,
                          height: 80,
                          borderRadius: '20px',
                          background: 'rgba(0, 127, 255, 0.1)',
                          mb: 3,
                        }}
                      >
                        <EventAvailableIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                      </Box>
                    </Box>
                    <Typography gutterBottom variant="h5" component="h3" align="center" fontWeight={600}>
                      Easy Booking
                    </Typography>
                    <Typography sx={{ mt: 2 }} color="text.secondary">
                      Book appointments with just a few clicks. View available time slots and choose what works best for you.
                      Manage your appointments from a simple dashboard.
                    </Typography>
                  </Box>
                </Card3D>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={4}>
              <motion.div variants={itemVariants}>
                <Card3D tiltEffect={!isMobile}>
                  <Box sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: 80,
                          height: 80,
                          borderRadius: '20px',
                          background: 'rgba(0, 188, 212, 0.1)',
                          mb: 3,
                        }}
                      >
                        <AccessTimeIcon sx={{ fontSize: 40, color: 'secondary.main' }} />
                      </Box>
                    </Box>
                    <Typography gutterBottom variant="h5" component="h3" align="center" fontWeight={600}>
                      Availability Management
                    </Typography>
                    <Typography sx={{ mt: 2 }} color="text.secondary">
                      For businesses, easily set your available hours and manage your schedule.
                      Prevent double-bookings and optimize your time with our smart calendar system.
                    </Typography>
                  </Box>
                </Card3D>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={4}>
              <motion.div variants={itemVariants}>
                <Card3D tiltEffect={!isMobile}>
                  <Box sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: 80,
                          height: 80,
                          borderRadius: '20px',
                          background: 'rgba(76, 175, 80, 0.1)',
                          mb: 3,
                        }}
                      >
                        <NotificationsActiveIcon sx={{ fontSize: 40, color: 'success.main' }} />
                      </Box>
                    </Box>
                    <Typography gutterBottom variant="h5" component="h3" align="center" fontWeight={600}>
                      Reminders & Notifications
                    </Typography>
                    <Typography sx={{ mt: 2 }} color="text.secondary">
                      Never miss an appointment with automatic email reminders.
                      Get notified about new bookings, cancellations, and schedule changes.
                    </Typography>
                  </Box>
                </Card3D>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Box>

      {/* Call to Action */}
      <Box
        sx={{
          py: isMobile ? 6 : 10,
          px: 2,
          mt: 4,
          borderRadius: { xs: '50px 50px 0 0', md: '100px 100px 0 0' },
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #1a237e 0%, #303f9f 100%)'
            : 'linear-gradient(135deg, #3949ab 0%, #5c6bc0 100%)',
        }}
      >
        <Box maxWidth="lg" sx={{ mx: 'auto' }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Typography 
                variant={isMobile ? "h4" : "h3"} 
                align="center"
                fontWeight={700}
                gutterBottom
                sx={{ mb: 2 }}
              >
                Ready to streamline your scheduling?
              </Typography>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Typography 
                variant="h6" 
                align="center" 
                paragraph 
                sx={{ 
                  mb: 4, 
                  opacity: 0.9,
                  maxWidth: 700,
                  mx: 'auto',
                  fontSize: isMobile ? '1rem' : '1.1rem',
                }}
              >
                Join thousands of businesses and customers who save time with our appointment scheduler.
              </Typography>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: 20,
              }}
            >
              <RippleButton
                onClick={handleGetStarted}
                variant="contained"
                color="secondary"
                style={{ 
                  backgroundColor: 'white',
                  color: theme.palette.primary.main,
                  padding: '14px 32px',
                  fontSize: isMobile ? '0.9rem' : '1.1rem',
                  fontWeight: 600,
                }}
                endIcon={<ArrowForwardIcon />}
              >
                Get Started Now
              </RippleButton>
            </motion.div>
          </motion.div>
        </Box>
        
        {/* Background decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            left: '5%',
            width: '20vw',
            height: '20vw',
            maxWidth: 300,
            maxHeight: 300,
            borderRadius: '40%',
            background: 'rgba(255,255,255,0.03)',
            filter: 'blur(50px)',
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '10%',
            right: '5%',
            width: '15vw',
            height: '15vw',
            maxWidth: 200,
            maxHeight: 200,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            filter: 'blur(40px)',
            zIndex: 0,
          }}
        />
      </Box>
    </>
  );
};

export default Home; 