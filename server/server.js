const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

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
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(null, true); // Allow all origins in case of misconfiguration
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'Authorization']
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

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
  });
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