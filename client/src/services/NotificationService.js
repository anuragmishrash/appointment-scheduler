import { toast } from 'react-toastify';

class NotificationService {
  constructor() {
    this.checkPermission();
    this.notifications = [];
    this.initialized = false;
    this.debugMode = true; // Enable debug mode
  }

  // Check if browser notifications are supported and permission is granted
  checkPermission() {
    this.hasSupport = 'Notification' in window;
    this.permission = this.hasSupport ? Notification.permission : 'denied';
    return this.permission === 'granted';
  }

  // Request permission for browser notifications
  async requestPermission() {
    if (!this.hasSupport) {
      console.log('Browser notifications not supported');
      return false;
    }
    
    try {
      if (this.permission !== 'granted') {
        const permission = await Notification.requestPermission();
        this.permission = permission;
        console.log(`Notification permission: ${permission}`);
        return permission === 'granted';
      }
      
      return true;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  // Initialize the notification service
  async initialize() {
    if (this.initialized) return;
    
    try {
      const hasPermission = await this.requestPermission();
      
      if (hasPermission) {
        console.log('Notification permission granted');
        // Send a test notification to confirm it's working
        if (this.debugMode) {
          this.showTestNotification();
        }
      } else {
        console.log('Notification permission denied');
      }
      
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing notification service:', error);
    }
  }

  // Show a test notification
  showTestNotification() {
    const title = 'Notification Test';
    const options = {
      body: 'Notifications are working correctly!',
      icon: '/logo192.png'
    };
    
    // Show browser notification
    if (this.permission === 'granted') {
      try {
        new Notification(title, options);
      } catch (error) {
        console.error('Error showing browser notification:', error);
      }
    }
    
    // Always show toast notification (for debug only)
    // toast.info('Notification system initialized successfully', {
    //   autoClose: 3000
    // });
  }

  // Schedule a notification for an appointment
  scheduleNotification(appointment) {
    if (!appointment || !appointment.date) return;
    
    try {
      const appointmentDate = new Date(appointment.date);
      const [hours, minutes] = appointment.startTime.split(':').map(Number);
      appointmentDate.setHours(hours, minutes);
      const now = new Date();
      
      // Calculate notification times based on appointment proximity
      let notificationTimes = [];
      const timeDiff = appointmentDate.getTime() - now.getTime();
      const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      
      // For debugging: show notification 10 seconds from now if in debug mode
      if (this.debugMode) {
        notificationTimes.push({
          label: 'debug',
          time: new Date(Date.now() + 10000) // 10 seconds from now
        });
        console.log(`Debug: Scheduling notification for ${appointment.service?.name} in 10 seconds`);
      } else {
        // Schedule based on how far away the appointment is
        if (daysDiff >= 2) {
          // If appointment is 2+ days away, notify 1 day before
          const oneDayBefore = new Date(appointmentDate);
          oneDayBefore.setDate(appointmentDate.getDate() - 1);
          oneDayBefore.setHours(9, 0, 0); // 9:00 AM
          
          if (oneDayBefore > now) {
            notificationTimes.push({
              label: '1 day before',
              time: oneDayBefore
            });
          }
        }
        
        // For all appointments, notify 1 hour before (if in the future)
        const oneHourBefore = new Date(appointmentDate.getTime() - 60 * 60 * 1000);
        if (oneHourBefore > now) {
          notificationTimes.push({
            label: '1 hour before',
            time: oneHourBefore
          });
        }
      }
      
      // Schedule all notifications
      for (const notification of notificationTimes) {
        if (notification.time > now) {
          const timeUntilNotification = notification.time.getTime() - now.getTime();
          console.log(`Scheduling ${notification.label} notification for ${timeUntilNotification}ms from now`);
        
        // Store notification info
        const notificationId = setTimeout(() => {
          this.showNotification(appointment);
        }, timeUntilNotification);
        
        this.notifications.push({
          id: notificationId,
          appointment,
            time: notification.time,
            label: notification.label
        });
      } else {
          console.log(`${notification.label} notification time is in the past, not scheduling`);
        }
      }
      
      return this.notifications.length > 0 ? this.notifications[this.notifications.length - 1].id : null;
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
    
    return null;
  }

  // Cancel a scheduled notification
  cancelNotification(notificationId) {
    clearTimeout(notificationId);
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
  }

  // Show a notification for an appointment
  showNotification(appointment) {
    try {
      // Get user info from appointment context to determine messaging
      const isBusinessAppointment = appointment.business && 
        appointment.user && 
        window.localStorage.getItem('userId') === appointment.business._id;
      
      // Calculate the time difference properly
      const appointmentDate = new Date(appointment.date);
      const [hours, minutes] = appointment.startTime.split(':').map(Number);
      appointmentDate.setHours(hours, minutes);
      const now = new Date();
      
      // Format the time remaining message
      let timeMessage;
      const timeDiff = appointmentDate.getTime() - now.getTime();
      const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      
      if (daysDiff > 0) {
        timeMessage = `in ${daysDiff} day${daysDiff > 1 ? 's' : ''} at ${appointment.startTime}`;
      } else {
        const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
        if (hoursDiff > 0) {
          timeMessage = `in ${hoursDiff} hour${hoursDiff > 1 ? 's' : ''} at ${appointment.startTime}`;
        } else {
          const minutesDiff = Math.floor(timeDiff / (1000 * 60));
          timeMessage = `in ${minutesDiff} minute${minutesDiff > 1 ? 's' : ''} at ${appointment.startTime}`;
        }
      }
      
      // Different content based on user context
      const title = isBusinessAppointment
        ? `Upcoming Appointment with ${appointment.user?.name || 'Client'}`
        : `Upcoming Appointment: ${appointment.service?.name || 'Appointment'}`;
      
      const body = isBusinessAppointment
        ? `You have an appointment scheduled ${timeMessage}.`
        : `Your appointment with ${appointment.business?.name || 'Provider'} is ${timeMessage}.`;
      
      const options = {
        body,
        icon: '/logo192.png'
      };
      
      console.log('Showing notification:', title);
      
      // Show browser notification if permission granted
      if (this.permission === 'granted') {
        new Notification(title, options);
      }
      
      // Always show toast notification
      toast.info(title + '\n' + options.body, {
        autoClose: 10000 // 10 seconds
      });
    } catch (error) {
      console.error('Error showing notification:', error);
      // Fallback to toast notification
      toast.info('You have an upcoming appointment', {
        autoClose: 5000
      });
    }
  }

  // Schedule notifications for all upcoming appointments
  scheduleAppointmentNotifications(appointments) {
    if (!appointments || !Array.isArray(appointments)) return;
    
    try {
      // Initialize the notification service if not already initialized
      if (!this.initialized) {
        this.initialize();
      }
      
      // Clear existing notifications
      this.clearAllNotifications();
      
      // Schedule new notifications for upcoming appointments
      const upcomingAppointments = appointments.filter(appointment => 
        appointment.status === 'scheduled' && 
        new Date(appointment.date) > new Date()
      );
      
      console.log(`Scheduling notifications for ${upcomingAppointments.length} upcoming appointments`);
      
      upcomingAppointments.forEach(appointment => {
        this.scheduleNotification(appointment);
      });
      
      // For debugging: if no upcoming appointments and in debug mode, show a test notification
      if (upcomingAppointments.length === 0 && this.debugMode) {
        setTimeout(() => {
          this.showTestNotification();
        }, 5000);
      }
    } catch (error) {
      console.error('Error scheduling appointment notifications:', error);
    }
  }

  // Clear all scheduled notifications
  clearAllNotifications() {
    this.notifications.forEach(notification => {
      clearTimeout(notification.id);
    });
    this.notifications = [];
    console.log('All notifications cleared');
  }
}

// Create a singleton instance
const notificationService = new NotificationService();

export default notificationService; 