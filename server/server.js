const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const cron = require('node-cron');
const Appointment = require('./models/Appointment');
const User = require('./models/User');
const Service = require('./models/Service');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Load environment variables
dotenv.config();

// Validate critical environment variables
const validateEnvironment = () => {
  // Check JWT_SECRET
  if (!process.env.JWT_SECRET) {
    console.error('\x1b[31m%s\x1b[0m', '❌ CRITICAL ERROR: JWT_SECRET environment variable is not set!');
    console.error('\x1b[33m%s\x1b[0m', '⚠️  Authentication will fail. Set JWT_SECRET in your environment or .env file.');
    
    // In development, we can set a temporary secret, but in production we should fail
    if (process.env.NODE_ENV === 'production') {
      console.error('\x1b[31m%s\x1b[0m', '❌ Refusing to start in production without JWT_SECRET. Exiting.');
      process.exit(1);
    } else {
      // Generate a temporary secret for development only
      const tempSecret = crypto.randomBytes(32).toString('hex');
      console.warn('\x1b[33m%s\x1b[0m', `⚠️  Setting temporary JWT_SECRET for development: ${tempSecret.substring(0, 10)}...`);
      process.env.JWT_SECRET = tempSecret;
    }
  } else if (process.env.JWT_SECRET.trim() === '') {
    console.error('\x1b[31m%s\x1b[0m', '❌ CRITICAL ERROR: JWT_SECRET environment variable is empty!');
    
    if (process.env.NODE_ENV === 'production') {
      console.error('\x1b[31m%s\x1b[0m', '❌ Refusing to start in production with empty JWT_SECRET. Exiting.');
      process.exit(1);
    } else {
      // Generate a temporary secret for development only
      const tempSecret = crypto.randomBytes(32).toString('hex');
      console.warn('\x1b[33m%s\x1b[0m', `⚠️  Setting temporary JWT_SECRET for development: ${tempSecret.substring(0, 10)}...`);
      process.env.JWT_SECRET = tempSecret;
    }
  } else if (process.env.JWT_SECRET.length < 16) {
    console.warn('\x1b[33m%s\x1b[0m', '⚠️  JWT_SECRET is very short. For security, use at least 32 characters.');
    if (process.env.NODE_ENV === 'production') {
      console.warn('\x1b[33m%s\x1b[0m', '⚠️  Running in production with a weak JWT_SECRET is not recommended.');
    }
  } else {
    console.log('\x1b[32m%s\x1b[0m', '✅ JWT_SECRET is configured');
  }
  
  // Check MongoDB connection string
  if (!process.env.MONGO_URI) {
    console.error('\x1b[31m%s\x1b[0m', '❌ MONGO_URI environment variable is not set!');
    console.error('\x1b[33m%s\x1b[0m', '⚠️  Will attempt to connect to default MongoDB URL (localhost)');
  } else {
    console.log('\x1b[32m%s\x1b[0m', '✅ MONGO_URI is configured');
  }
  
  // Log all environment variables (excluding sensitive ones)
  console.log('\nEnvironment configuration:');
  console.log(`NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
  console.log(`PORT: ${process.env.PORT || '5000 (default)'}`);
  console.log(`TIMEZONE: ${process.env.TIMEZONE || process.env.TZ || 'UTC (default)'}`);
  console.log(`CLIENT_URL: ${process.env.CLIENT_URL || 'not set'}`);
  console.log(`JWT_SECRET: ${process.env.JWT_SECRET ? '******' : 'not set'}`);
  console.log(`EMAIL_USER: ${process.env.EMAIL_USER ? '******' : 'not set'}`);
  console.log('\n');
};

// Run environment validation
validateEnvironment();

// Set timezone for consistent date handling
process.env.TZ = process.env.TIMEZONE || process.env.TZ || 'UTC';
console.log(`Server running with timezone: ${process.env.TZ}`);
console.log(`IMPORTANT: For proper timezone handling, set the TIMEZONE or TZ environment variable to your local timezone (e.g. 'Asia/Kolkata', 'America/New_York')`);

// Connect to MongoDB
connectDB().catch(err => {
  console.error('Failed to connect to MongoDB', err);
  process.exit(1);
});

// Handle MongoDB connection events
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed due to app termination');
  process.exit(0);
});

// Import routes
const authRoutes = require('./routes/auth');
const appointmentRoutes = require('./routes/appointments');
const availabilityRoutes = require('./routes/availability');
const serviceRoutes = require('./routes/services');
const userRoutes = require('./routes/users');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// List of allowed origins
const allowedOrigins = [
  'https://appointment-scheduler-d04b5avyp-anurags-projects-cdaddaeb.vercel.app',
  'https://appointment-scheduler-client.vercel.app',
  'https://appointment-scheduler-drab.vercel.app',
  'http://localhost:3000'
];

if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list or we're in development mode
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      console.log('CORS request from unauthorized origin:', origin);
      // In production, we still allow all origins to prevent issues, but log the warning
      console.warn(`⚠️  Non-whitelisted origin: ${origin}. Consider adding to allowedOrigins if legitimate.`);
      callback(null, true); 
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Middleware
app.use(cors(corsOptions));

// Request body parsers with increased limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Debug middleware for registration requests
app.use('/api/auth/register', (req, res, next) => {
  console.log('Registration request headers:', req.headers);
  console.log('Registration request body type:', typeof req.body);
  console.log('Body has name property:', req.body && 'name' in req.body);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/users', userRoutes);

// Root route (for health check or friendly message)
app.get('/', (req, res) => {
  res.send('🚀 Appointment Scheduler Backend is Running!');
});

// Add a health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Configure nodemailer for expired appointments
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Schedule job to check for expired appointments every hour
cron.schedule('0 * * * *', async () => {
  console.log('Running scheduled expired appointment check');
  await checkForExpiredAppointments();
});

// Schedule job to check for missed appointments every 5 minutes
// This will mark appointments as missed if they are 15+ minutes past the start time
cron.schedule('*/5 * * * *', async () => {
  console.log('Running missed appointment check');
  await checkForMissedAppointments();
});

// Schedule job to send appointment reminders every 5 minutes
// This will send reminders for appointments 10 minutes before they start
cron.schedule('*/5 * * * *', async () => {
  console.log('Checking for appointment reminders to send');
  await sendAppointmentReminders();
});

// Also run once when server starts
console.log('Running initial expired appointment check');
checkForExpiredAppointments();

// Also check for missed appointments on server start
console.log('Running initial missed appointment check');
checkForMissedAppointments();

// Also send appointment reminders on server start
console.log('Checking for initial appointment reminders');
sendAppointmentReminders();

// Restore any future appointments that were incorrectly cancelled
console.log('Checking for incorrectly auto-cancelled future appointments');
restoreIncorrectlyAutoCancel();

// Function to restore incorrectly auto-cancelled future appointments
async function restoreIncorrectlyAutoCancel() {
  try {
    const now = new Date();
    console.log(`Checking for incorrectly marked appointments at ${now.toISOString()}`);
    
    // Create date objects for today's date (without time component)
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    
    // Current time as string in HH:MM format
    const currentTimeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    console.log(`Current time string: ${currentTimeString}`);
    
    // Find future appointments that were auto-marked as missed
    const futureMissedAppointments = await Appointment.find({
      $or: [
        // Either date is in the future
        { 
          date: { $gt: tomorrowStart },
          status: 'missed',
          autoCancelled: true
        },
        // Or date is today but time is in the future
        {
          date: {
            $gte: todayStart,
            $lt: tomorrowStart
          },
          startTime: { 
            $gte: currentTimeString
          },
          status: 'missed',
          autoCancelled: true
        }
      ]
    })
    .populate('user', 'name email')
    .populate('service')
    .populate('business', 'name email isDemo');
    
    console.log(`Found ${futureMissedAppointments.length} future appointments to restore`);
    
    // Debug: log all found appointments
    if (futureMissedAppointments.length > 0) {
      futureMissedAppointments.forEach(appt => {
        const apptDate = new Date(appt.date);
        console.log(`Restoring appointment: ${appt._id}, Service: ${appt.service?.name || 'Unknown'}, Date: ${apptDate.toLocaleDateString()}, Time: ${appt.startTime}, Year: ${apptDate.getFullYear()}`);
      });
    }
    
    // Restore each appointment
    let restoredCount = 0;
    for (const appointment of futureMissedAppointments) {
      appointment.status = 'scheduled';
      appointment.autoCancelled = false;
      await appointment.save();
      restoredCount++;
      console.log(`Restored appointment ${appointment._id} for ${appointment.user.name}`);
      
      // Send email to user about restoration
      if (appointment.user && appointment.user.email) {
        const userMailOptions = {
          from: process.env.EMAIL_USER,
          to: appointment.user.email,
          subject: 'Appointment Restored',
          html: `
            <h1>Appointment Restored</h1>
            <p>Your appointment scheduled for ${new Date(appointment.date).toLocaleDateString()} at ${appointment.startTime} has been restored.</p>
            <p>Service: ${appointment.service ? appointment.service.name : 'N/A'}</p>
            <p>Business: ${appointment.business ? appointment.business.name : 'N/A'}</p>
            <p>We apologize for the inconvenience.</p>
          `
        };
        
        transporter.sendMail(userMailOptions, (error) => {
          if (error) {
            console.error('Email sending error to user:', error);
          } else {
            console.log(`Restoration email sent to user: ${appointment.user.email}`);
          }
        });
      }
      
      // Send email to business
      if (appointment.business && appointment.business.email && !appointment.business.isDemo) {
        const businessMailOptions = {
          from: process.env.EMAIL_USER,
          to: appointment.business.email,
          subject: 'Appointment Restored',
          html: `
            <h1>Appointment Restored</h1>
            <p>An appointment scheduled for ${new Date(appointment.date).toLocaleDateString()} at ${appointment.startTime} has been restored.</p>
            <p>Service: ${appointment.service ? appointment.service.name : 'N/A'}</p>
            <p>Customer: ${appointment.user ? appointment.user.name : 'N/A'}</p>
          `
        };
        
        transporter.sendMail(businessMailOptions, (error) => {
          if (error) {
            console.error('Email sending error to business:', error);
          } else {
            console.log(`Restoration email sent to business: ${appointment.business.email}`);
          }
        });
      }
    }
    
    return restoredCount;
  } catch (error) {
    console.error('Error restoring incorrectly marked missed appointments:', error);
    return 0;
  }
}

// Function to check for and handle expired appointments
async function checkForExpiredAppointments() {
  try {
    const now = new Date();
    console.log(`Checking for expired appointments at ${now.toISOString()}`);
    
    // Create date objects for today's date (without time component)
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    
    // Current time as string in HH:MM format
    const currentTimeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    console.log(`Current time string: ${currentTimeString}`);
    
    // Find appointments that are in the past but not cancelled or completed
    // We only want to handle appointments from BEFORE today, not today's appointments
    // Today's appointments should be handled by checkForMissedAppointments with grace period
    const expiredAppointments = await Appointment.find({
      $and: [
        // Only include appointments from past days (not today)
        { date: { $lt: todayStart } },
        // And the status is not already cancelled, completed or missed
        { status: { $nin: ['cancelled', 'completed', 'missed'] } }
      ]
    })
    .populate('user', 'name email')
    .populate('service')
    .populate('business', 'name email isDemo');
    
    console.log(`Found ${expiredAppointments.length} expired appointments from past days to mark as missed`);
    
    // Debug: log all found appointments
    if (expiredAppointments.length > 0) {
      expiredAppointments.forEach(appt => {
        const apptDate = new Date(appt.date);
        console.log(`Expired appointment: ${appt._id}, Service: ${appt.service?.name || 'Unknown'}, Date: ${apptDate.toLocaleDateString()}, Time: ${appt.startTime}, Status: ${appt.status}, Year: ${apptDate.getFullYear()}`);
      });
    }
    
    // Update each appointment and send notifications
    for (const appointment of expiredAppointments) {
      // Update appointment status to missed and mark as auto-cancelled
      appointment.status = 'missed';
      appointment.autoCancelled = true;
      await appointment.save();
      console.log(`Auto-marked appointment ${appointment._id} as missed (from past day)`);
      
      // Send email to user
      if (appointment.user && appointment.user.email) {
        const userMailOptions = {
          from: process.env.EMAIL_USER,
          to: appointment.user.email,
          subject: 'Appointment Missed',
          html: `
            <h1>Appointment Marked as Missed</h1>
            <p>Your appointment scheduled for ${new Date(appointment.date).toLocaleDateString()} at ${appointment.startTime} has been marked as missed as the scheduled time has passed.</p>
            <p>Service: ${appointment.service ? appointment.service.name : 'N/A'}</p>
            <p>Business: ${appointment.business ? appointment.business.name : 'N/A'}</p>
            <p>If you would like to reschedule, please book a new appointment.</p>
          `
        };
        
        transporter.sendMail(userMailOptions, (error) => {
          if (error) {
            console.error('Email sending error to user:', error);
          } else {
            console.log(`Missed appointment email sent to user: ${appointment.user.email}`);
          }
        });
      }
      
      // Send email to business
      if (appointment.business && appointment.business.email && !appointment.business.isDemo) {
        const businessMailOptions = {
          from: process.env.EMAIL_USER,
          to: appointment.business.email,
          subject: 'Appointment Missed',
          html: `
            <h1>Customer Missed Appointment</h1>
            <p>The appointment scheduled for ${new Date(appointment.date).toLocaleDateString()} at ${appointment.startTime} has been marked as missed as the scheduled time has passed.</p>
            <p>Service: ${appointment.service ? appointment.service.name : 'N/A'}</p>
            <p>Customer: ${appointment.user ? appointment.user.name : 'N/A'}</p>
          `
        };
        
        transporter.sendMail(businessMailOptions, (error) => {
          if (error) {
            console.error('Email sending error to business:', error);
          } else {
            console.log(`Missed appointment email sent to business: ${appointment.business.email}`);
          }
        });
      }
    }
    
    return expiredAppointments.length;
  } catch (error) {
    console.error('Error in expired appointment check:', error);
    return 0;
  }
}

// Function to check for missed appointments
async function checkForMissedAppointments() {
  try {
    const now = new Date();
    console.log(`Checking for missed appointments at ${now.toISOString()}`);
    
    // Calculate the time 15 minutes ago to apply the grace period
    const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);
    const graceHour = fifteenMinutesAgo.getHours().toString().padStart(2, '0');
    const graceMinute = fifteenMinutesAgo.getMinutes().toString().padStart(2, '0');
    const graceTimeString = `${graceHour}:${graceMinute}`;
    
    console.log(`Current time minus 15 minutes: ${graceTimeString}`);
    
    // Create date objects for today's date (without time component)
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Find all scheduled appointments - we'll filter them in JavaScript
    // This avoids complex MongoDB queries with time strings that can cause issues
    const scheduledAppointments = await Appointment.find({
      status: 'scheduled'
    })
    .populate('user', 'name email')
    .populate('service')
    .populate('business', 'name email isDemo');
    
    console.log(`Found ${scheduledAppointments.length} scheduled appointments to check for missed status`);
    
    // Now filter them in JavaScript where we have more control
    const missedAppointments = scheduledAppointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      // If appointment date is before today, it's missed
      // (But these should have been handled by checkForExpiredAppointments already)
      if (appointmentDate < today) {
        console.log(`Appointment ${appointment._id} is missed (past date)`);
        return true;
      }
      
      // If appointment is today, check if grace period has passed
      if (appointmentDate.toDateString() === today.toDateString()) {
        const [hours, minutes] = appointment.startTime.split(':').map(Number);
        
        // Skip future appointments
        if (hours > now.getHours() || 
            (hours === now.getHours() && minutes > now.getMinutes())) {
          return false;
        }
        
        // Create appointment time
        const appointmentTime = new Date(appointmentDate);
        appointmentTime.setHours(hours, minutes);
        
        // Calculate appointment end time with 15-minute grace period
        const appointmentTimeWithGrace = new Date(appointmentTime.getTime() + 15 * 60 * 1000);
        
        // Only mark as missed if grace period has passed
        if (now > appointmentTimeWithGrace) {
          console.log(`Appointment ${appointment._id} is missed (grace period elapsed)`);
          console.log(`Start time: ${appointmentTime.toISOString()}`);
          console.log(`Grace period ends: ${appointmentTimeWithGrace.toISOString()}`);
          console.log(`Current time: ${now.toISOString()}`);
          console.log(`Minutes since grace ended: ${Math.floor((now - appointmentTimeWithGrace) / (1000 * 60))}`);
          return true;
        } else {
          const minutesLeft = Math.floor((appointmentTimeWithGrace - now) / (1000 * 60));
          console.log(`Appointment ${appointment._id} is not missed yet, ${minutesLeft} minutes left in grace period`);
          return false;
        }
      }
      
      // Future appointment
      return false;
    });
    
    console.log(`Found ${missedAppointments.length} missed appointments after grace period check`);
    
    // Debug: log all found appointments
    if (missedAppointments.length > 0) {
      missedAppointments.forEach(appt => {
        const apptDate = new Date(appt.date);
        console.log(`Missed appointment: ${appt._id}, Service: ${appt.service?.name || 'Unknown'}, Date: ${apptDate.toLocaleDateString()}, Time: ${appt.startTime}`);
      });
    }
    
    // Update each appointment and send notifications
    for (const appointment of missedAppointments) {
      // Update appointment status to missed
      appointment.status = 'missed';
      await appointment.save();
      console.log(`Marked appointment ${appointment._id} as missed after 15-minute grace period`);
      
      // Send email to user
      if (appointment.user && appointment.user.email) {
        const userMailOptions = {
          from: process.env.EMAIL_USER,
          to: appointment.user.email,
          subject: 'Missed Appointment',
          html: `
            <h1>Appointment Marked as Missed</h1>
            <p>Your appointment scheduled for ${new Date(appointment.date).toLocaleDateString()} at ${appointment.startTime} has been marked as missed as you did not attend within the 15-minute grace period.</p>
            <p>Service: ${appointment.service ? appointment.service.name : 'N/A'}</p>
            <p>Business: ${appointment.business ? appointment.business.name : 'N/A'}</p>
            <p>If you would like to reschedule, please book a new appointment.</p>
          `
        };
        
        transporter.sendMail(userMailOptions, (error) => {
          if (error) {
            console.error('Email sending error to user:', error);
          } else {
            console.log(`Missed appointment email sent to user: ${appointment.user.email}`);
          }
        });
      }
      
      // Send email to business
      if (appointment.business && appointment.business.email && !appointment.business.isDemo) {
        const businessMailOptions = {
          from: process.env.EMAIL_USER,
          to: appointment.business.email,
          subject: 'Appointment Missed',
          html: `
            <h1>Customer Missed Appointment</h1>
            <p>The appointment scheduled for ${new Date(appointment.date).toLocaleDateString()} at ${appointment.startTime} has been marked as missed as the customer did not attend within the 15-minute grace period.</p>
            <p>Service: ${appointment.service ? appointment.service.name : 'N/A'}</p>
            <p>Customer: ${appointment.user ? appointment.user.name : 'N/A'}</p>
          `
        };
        
        transporter.sendMail(businessMailOptions, (error) => {
          if (error) {
            console.error('Email sending error to business:', error);
          } else {
            console.log(`Missed appointment email sent to business: ${appointment.business.email}`);
          }
        });
      }
    }
    
    return missedAppointments.length;
  } catch (error) {
    console.error('Error in missed appointment check:', error);
    return 0;
  }
}

// Function to send appointment reminders 10 minutes before
async function sendAppointmentReminders() {
  try {
    const now = new Date();
    console.log(`Checking for appointment reminders at ${now.toISOString()}`);
    
    // Create date objects for today's date (without time component)
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Get all scheduled appointments
    const scheduledAppointments = await Appointment.find({
      status: 'scheduled',
      reminderSent: { $ne: true } // Only get appointments where reminder hasn't been sent
    })
    .populate('user', 'name email')
    .populate('service')
    .populate('business', 'name email isDemo');
    
    console.log(`Found ${scheduledAppointments.length} scheduled appointments to check for reminders`);
    
    // Filter for appointments that are coming up in 10-15 minutes
    const upcomingAppointments = scheduledAppointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      const [hours, minutes] = appointment.startTime.split(':').map(Number);
      const appointmentTime = new Date(appointmentDate);
      appointmentTime.setHours(hours, minutes);
      
      // Calculate time difference in minutes
      const diffMinutes = Math.floor((appointmentTime - now) / (1000 * 60));
      console.log(`Appointment ${appointment._id} is in ${diffMinutes} minutes`);
      
      // We want to send reminders for appointments that are 10-15 minutes away
      return diffMinutes >= 10 && diffMinutes <= 15;
    });
    
    console.log(`Found ${upcomingAppointments.length} appointments to send reminders for`);
    
    // Debug: log all found appointments
    if (upcomingAppointments.length > 0) {
      upcomingAppointments.forEach(appt => {
        const apptDate = new Date(appt.date);
        const [hours, minutes] = appt.startTime.split(':').map(Number);
        const apptTime = new Date(apptDate);
        apptTime.setHours(hours, minutes);
        
        const diffMinutes = Math.floor((apptTime - now) / (1000 * 60));
        console.log(`Sending reminder for appointment: ${appt._id}, Service: ${appt.service?.name || 'Unknown'}, Date: ${apptDate.toLocaleDateString()}, Time: ${appt.startTime}, Minutes until: ${diffMinutes}`);
      });
    }
    
    // Send reminders for each appointment
    for (const appointment of upcomingAppointments) {
      // Mark reminder as sent so we don't send duplicates
      appointment.reminderSent = true;
      await appointment.save();
      console.log(`Setting reminder flag for appointment ${appointment._id}`);
      
      // Get time until appointment for message
      const appointmentDate = new Date(appointment.date);
      const [hours, minutes] = appointment.startTime.split(':').map(Number);
      const appointmentTime = new Date(appointmentDate);
      appointmentTime.setHours(hours, minutes);
      const minutesUntil = Math.floor((appointmentTime - now) / (1000 * 60));
      
      // Send email to user
      if (appointment.user && appointment.user.email) {
        const userMailOptions = {
          from: process.env.EMAIL_USER,
          to: appointment.user.email,
          subject: 'Appointment Reminder - Starting Soon',
          html: `
            <h1>Appointment Reminder</h1>
            <p>This is a reminder that your appointment is scheduled to begin in ${minutesUntil} minutes.</p>
            <p>Date: ${new Date(appointment.date).toLocaleDateString()}</p>
            <p>Time: ${appointment.startTime}</p>
            <p>Service: ${appointment.service ? appointment.service.name : 'N/A'}</p>
            <p>Business: ${appointment.business ? appointment.business.name : 'N/A'}</p>
            <p>Please arrive on time. There is a 15-minute grace period, after which the appointment will be marked as missed.</p>
          `
        };
        
        transporter.sendMail(userMailOptions, (error) => {
          if (error) {
            console.error('Email sending error to user:', error);
          } else {
            console.log(`Reminder email sent to user: ${appointment.user.email}`);
          }
        });
      }
      
      // Send email to business
      if (appointment.business && appointment.business.email && !appointment.business.isDemo) {
        const businessMailOptions = {
          from: process.env.EMAIL_USER,
          to: appointment.business.email,
          subject: 'Upcoming Appointment Reminder',
          html: `
            <h1>Upcoming Appointment Reminder</h1>
            <p>This is a reminder that you have an appointment scheduled to begin in ${minutesUntil} minutes.</p>
            <p>Date: ${new Date(appointment.date).toLocaleDateString()}</p>
            <p>Time: ${appointment.startTime}</p>
            <p>Service: ${appointment.service ? appointment.service.name : 'N/A'}</p>
            <p>Customer: ${appointment.user ? appointment.user.name : 'N/A'}</p>
          `
        };
        
        transporter.sendMail(businessMailOptions, (error) => {
          if (error) {
            console.error('Email sending error to business:', error);
          } else {
            console.log(`Reminder email sent to business: ${appointment.business.email}`);
          }
        });
      }
    }
    
    return upcomingAppointments.length;
  } catch (error) {
    console.error('Error sending appointment reminders:', error);
    return 0;
  }
}

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
  });
}

// Setup keep-alive service for production
if (process.env.NODE_ENV === 'production') {
  // Simple keep-alive mechanism to prevent Render from spinning down
  const PING_INTERVAL = 840000; // 14 minutes (just under Render's 15-min timeout)
  const keepAliveUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
  
  console.log(`Setting up keep-alive service for ${keepAliveUrl}`);
  
  // Internal ping
  setInterval(() => {
    fetch(`${keepAliveUrl}/api/health`)
      .then(response => {
        if (response.ok) {
          console.log(`[${new Date().toISOString()}] Keep-alive ping successful`);
        } else {
          console.log(`[${new Date().toISOString()}] Keep-alive ping failed with status: ${response.status}`);
        }
      })
      .catch(error => {
        console.log(`[${new Date().toISOString()}] Keep-alive ping error: ${error.message}`);
      });
  }, PING_INTERVAL);

  // Set up external ping service instructions
  const { setupExternalPingService } = require('./utils/keepAlive');
  setupExternalPingService(keepAliveUrl);
}

// Custom error handling middleware
app.use((err, req, res, next) => {
  console.error('Error details:', err);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(error => error.message);
    return res.status(400).json({ 
      message: 'Validation error', 
      errors 
    });
  }
  
  // MongoDB duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({ 
      message: 'Duplicate value error',
      field: Object.keys(err.keyValue)[0]
    });
  }
  
  res.status(err.status || 500).json({ 
    message: err.message || 'Something went wrong on the server',
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
}); 