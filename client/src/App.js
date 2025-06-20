import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import api from './api/axios';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AppNotification from './components/layout/AppNotification';

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
import ServiceForm from './pages/ServiceForm';
import AvailabilityForm from './pages/AvailabilityForm';
import NotFound from './pages/NotFound';

// Protected Route Component
const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
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
      {/* Empty Navbar component */}
      <Navbar />
      {/* Empty AppNotification component */}
      {user && <AppNotification appointments={appointments} />}
      <div className="container">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes - Users */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/appointments/new" 
            element={
              <ProtectedRoute>
                <AppointmentForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/appointments/:id" 
            element={
              <ProtectedRoute>
                <AppointmentDetails />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/appointments/reschedule/:id" 
            element={
              <ProtectedRoute>
                <RescheduleAppointment />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/calendar" 
            element={
              <ProtectedRoute>
                <CalendarView />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected Routes - Business */}
          <Route 
            path="/business/dashboard" 
            element={
              <ProtectedRoute roles={['business', 'admin']}>
                <BusinessDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/business/services/new" 
            element={
              <ProtectedRoute roles={['business', 'admin']}>
                <ServiceForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/business/services/:id" 
            element={
              <ProtectedRoute roles={['business', 'admin']}>
                <ServiceForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/business/availability" 
            element={
              <ProtectedRoute roles={['business', 'admin']}>
                <AvailabilityForm />
              </ProtectedRoute>
            } 
          />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      {/* Empty Footer component */}
      <Footer />
    </>
  );
};

export default App; 