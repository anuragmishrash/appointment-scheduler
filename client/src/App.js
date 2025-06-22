import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import api from './api/axios';
import { AnimatePresence } from 'framer-motion';
import { CssBaseline, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AppNotification from './components/layout/AppNotification';
import PageTransition from './components/common/PageTransition';
import CustomLoader from './components/common/CustomLoader';

// Page Components
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AppointmentForm from './pages/AppointmentForm';
import AppointmentDetails from './pages/AppointmentDetails';
import RescheduleAppointment from './pages/RescheduleAppointment';
import CalendarView from './pages/CalendarView';
import Profile from './pages/Profile';
import BusinessDashboard from './pages/BusinessDashboard';
import BusinessBookingDashboard from './pages/BusinessBookingDashboard';
import ServiceForm from './pages/ServiceForm';
import AvailabilityForm from './pages/AvailabilityForm';
import NotFound from './pages/NotFound';

// Protected Route Component
const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth();
  const theme = useTheme();
  
  if (loading) {
    return <CustomLoader fullScreen textColor={theme.palette.primary.main} />;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

const App = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const location = useLocation();

  useEffect(() => {
    // Fetch appointments for notifications if user is logged in
    const fetchAppointments = async () => {
      if (!user) return;
      
      try {
        const res = await api.get('/api/appointments');
        setAppointments(res.data);
      } catch (error) {
        console.error('Error fetching appointments for notifications:', error);
      }
    };

    fetchAppointments();
  }, [user]);

  return (
    <>
      <CssBaseline />
      <Navbar />
      {user && <AppNotification appointments={appointments} />}
      <Box 
        className="container" 
        sx={{ 
          minHeight: 'calc(100vh - 64px - 100px)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <AnimatePresence mode="wait">
          <Routes key={location.pathname} location={location}>
            {/* Public Routes */}
            <Route 
              path="/" 
              element={
                <PageTransition>
                  <Home />
                </PageTransition>
              } 
            />
            <Route 
              path="/login" 
              element={
                <PageTransition>
                  <Login />
                </PageTransition>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PageTransition>
                  <Register />
                </PageTransition>
              } 
            />
            
            {/* Protected Routes - Users */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <Dashboard />
                  </PageTransition>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/appointments/new" 
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <AppointmentForm />
                  </PageTransition>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/appointments/:id" 
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <AppointmentDetails />
                  </PageTransition>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/appointments/reschedule/:id" 
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <RescheduleAppointment />
                  </PageTransition>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/calendar" 
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <CalendarView />
                  </PageTransition>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <Profile />
                  </PageTransition>
                </ProtectedRoute>
              } 
            />
            
            {/* Protected Routes - Business */}
            <Route 
              path="/business/dashboard" 
              element={
                <ProtectedRoute roles={['business', 'admin']}>
                  <PageTransition>
                    <BusinessDashboard />
                  </PageTransition>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/business/booking-dashboard" 
              element={
                <ProtectedRoute roles={['business', 'admin']}>
                  <PageTransition>
                    <BusinessBookingDashboard />
                  </PageTransition>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/services/new" 
              element={
                <ProtectedRoute roles={['business', 'admin']}>
                  <PageTransition>
                    <ServiceForm />
                  </PageTransition>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/services/edit/:id" 
              element={
                <ProtectedRoute roles={['business', 'admin']}>
                  <PageTransition>
                    <ServiceForm />
                  </PageTransition>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/availability" 
              element={
                <ProtectedRoute roles={['business', 'admin']}>
                  <PageTransition>
                    <AvailabilityForm />
                  </PageTransition>
                </ProtectedRoute>
              } 
            />
            
            {/* 404 Not Found Route */}
            <Route 
              path="*" 
              element={
                <PageTransition>
                  <NotFound />
                </PageTransition>
              } 
            />
          </Routes>
        </AnimatePresence>
      </Box>
      <Footer />
    </>
  );
};

export default App; 