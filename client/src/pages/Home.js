import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Container, 
  Grid, 
  Typography, 
  Card, 
  CardContent
} from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

const Home = () => {
  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box
        sx={{
          pt: 8,
          pb: 6,
          textAlign: 'center'
        }}
      >
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
        >
          Appointment Scheduler
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" paragraph>
          Streamline your appointment booking process. Easy to use for both businesses and customers.
          Book appointments, manage your schedule, and receive reminders all in one place.
        </Typography>
        <Box
          sx={{
            mt: 4,
            display: 'flex',
            justifyContent: 'center',
            gap: 2
          }}
        >
          <Button 
            variant="contained" 
            size="large" 
            component={RouterLink} 
            to="/register"
          >
            Sign Up Now
          </Button>
          <Button 
            variant="outlined" 
            size="large" 
            component={RouterLink} 
            to="/login"
          >
            Login
          </Button>
        </Box>
      </Box>

      {/* Features Section */}
      <Typography
        component="h2"
        variant="h4"
        align="center"
        color="text.primary"
        gutterBottom
        sx={{ mb: 4 }}
      >
        Key Features
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
              <EventAvailableIcon sx={{ fontSize: 60, color: 'primary.main' }} />
            </Box>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h5" component="h3" align="center">
                Easy Booking
              </Typography>
              <Typography>
                Book appointments with just a few clicks. View available time slots and choose what works best for you.
                Manage your appointments from a simple dashboard.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
              <AccessTimeIcon sx={{ fontSize: 60, color: 'primary.main' }} />
            </Box>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h5" component="h3" align="center">
                Availability Management
              </Typography>
              <Typography>
                For businesses, easily set your available hours and manage your schedule.
                Prevent double-bookings and optimize your time with our smart calendar system.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
              <NotificationsActiveIcon sx={{ fontSize: 60, color: 'primary.main' }} />
            </Box>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h5" component="h3" align="center">
                Reminders & Notifications
              </Typography>
              <Typography>
                Never miss an appointment with automatic email reminders.
                Get notified about new bookings, cancellations, and schedule changes.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Call to Action */}
      <Box
        sx={{
          pt: 8,
          pb: 6,
          mt: 8,
          backgroundColor: 'primary.light',
          borderRadius: 2,
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Typography variant="h4" gutterBottom>
          Ready to streamline your scheduling?
        </Typography>
        <Typography variant="h6" paragraph sx={{ mb: 4 }}>
          Join thousands of businesses and customers who save time with our appointment scheduler.
        </Typography>
        <Button 
          variant="contained" 
          size="large" 
          component={RouterLink} 
          to="/register"
          sx={{ 
            backgroundColor: 'white', 
            color: 'primary.main',
            '&:hover': {
              backgroundColor: 'grey.100',
            }
          }}
        >
          Get Started Now
        </Button>
      </Box>
    </Container>
  );
};

export default Home; 