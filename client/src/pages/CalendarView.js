import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Container,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent
} from '@mui/material';
import { toast } from 'react-toastify';

const CalendarView = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get('/api/appointments');
        setAppointments(res.data);
        setError('');
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setError('Failed to load appointments');
        toast.error('Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAppointments();
    }
  }, [user]);

  // Convert appointments to calendar events
  const events = appointments.map(appointment => {
    const startDate = new Date(appointment.date);
    const [startHours, startMinutes] = appointment.startTime.split(':').map(Number);
    startDate.setHours(startHours, startMinutes);
    
    const endDate = new Date(appointment.date);
    const [endHours, endMinutes] = appointment.endTime.split(':').map(Number);
    endDate.setHours(endHours, endMinutes);
    
    return {
      id: appointment._id,
      title: appointment.service?.name || 'Appointment',
      start: startDate,
      end: endDate,
      extendedProps: {
        business: appointment.business?.name,
        status: appointment.status,
        notes: appointment.notes,
        time: `${appointment.startTime} - ${appointment.endTime}`
      },
      backgroundColor: 
        appointment.status === 'scheduled' ? '#4caf50' : 
        appointment.status === 'cancelled' ? '#f44336' : 
        appointment.status === 'completed' ? '#9e9e9e' : 
        '#2196f3',
      borderColor: 
        appointment.status === 'scheduled' ? '#2e7d32' : 
        appointment.status === 'cancelled' ? '#c62828' : 
        appointment.status === 'completed' ? '#616161' : 
        '#1976d2'
    };
  });

  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleViewDetails = () => {
    navigate(`/appointments/${selectedEvent.id}`);
    setOpenDialog(false);
  };

  // Custom event rendering
  const renderEventContent = (eventInfo) => {
    return (
      <>
        <div style={{ fontWeight: 'bold', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {eventInfo.event.title}
        </div>
        <div style={{ fontSize: '0.85em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {eventInfo.timeText}
        </div>
        {eventInfo.view.type !== 'dayGridMonth' && (
          <div style={{ fontSize: '0.85em', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {eventInfo.event.extendedProps.business}
          </div>
        )}
      </>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Appointment Calendar
      </Typography>
      
      <Paper sx={{ p: 2, mt: 3 }}>
        <Box sx={{ height: 'calc(100vh - 300px)', minHeight: '600px', '& .fc': { 
          // FullCalendar custom styling
          '& .fc-event': {
            cursor: 'pointer',
            borderRadius: '4px',
            padding: '2px 4px',
            margin: '1px 0'
          },
          '& .fc-toolbar-title': {
            fontSize: '1.2rem',
            fontWeight: 'bold'
          },
          '& .fc-col-header-cell': {
            padding: '8px 0',
            backgroundColor: '#f5f5f5'
          },
          '& .fc-day-today': {
            backgroundColor: 'rgba(66, 165, 245, 0.1) !important'
          },
          '& .fc-timegrid-slot': {
            height: '48px !important'
          },
          '& .fc-timegrid-event': {
            margin: '0 2px'
          },
          '& .fc-daygrid-event': {
            whiteSpace: 'normal'
          }
        }}}>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            events={events}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              meridiem: true
            }}
            slotMinTime="07:00:00"
            slotMaxTime="22:00:00"
            allDaySlot={false}
            slotDuration="00:30:00"
            height="100%"
            expandRows={true}
          />
        </Box>
      </Paper>
      
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Calendar Legend
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#4caf50', mr: 1 }} />
              <Typography variant="body2">Scheduled</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#f44336', mr: 1 }} />
              <Typography variant="body2">Cancelled</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#9e9e9e', mr: 1 }} />
              <Typography variant="body2">Completed</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
      
      {selectedEvent && (
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>
            {selectedEvent.title}
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              <strong>Date:</strong> {selectedEvent.start.toLocaleDateString()}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Time:</strong> {selectedEvent.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {selectedEvent.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Provider:</strong> {selectedEvent.extendedProps.business}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Status:</strong> {selectedEvent.extendedProps.status}
            </Typography>
            {selectedEvent.extendedProps.notes && (
              <Typography variant="body1" gutterBottom>
                <strong>Notes:</strong> {selectedEvent.extendedProps.notes}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Close</Button>
            <Button onClick={handleViewDetails} color="primary">
              View Details
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default CalendarView; 