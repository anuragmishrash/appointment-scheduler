# Appointment Scheduler

A full-stack web application for scheduling and managing appointments. Built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- User authentication (signup, login, logout)
- Appointment booking and management (create, read, update, delete)
- Calendar integration for availability checking
- Notifications for upcoming appointments
- Time slot selection with availability checking
- Rescheduling and cancellation of appointments
- Business management dashboard
- Service management for businesses

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Nodemailer for email notifications

### Frontend
- React.js
- React Router for navigation
- Material UI for components
- Axios for API requests
- React-Toastify for notifications
- React-Datepicker for date selection

## Project Structure

```
appointment-scheduler/
├── client/                # React frontend
│   ├── public/            # Static files
│   │   ├── images/        # Image assets
│   │   ├── index.html     # HTML template
│   │   └── manifest.json  # PWA manifest
│   └── src/               # React source code
│       ├── api/           # API configuration (axios setup)
│       ├── context/       # React context (auth, etc.)
│       ├── pages/         # Page components
│       │   ├── AppointmentDetails.js
│       │   ├── AppointmentForm.js
│       │   ├── AvailabilityForm.js
│       │   ├── BusinessDashboard.js
│       │   ├── CalendarView.js
│       │   ├── Dashboard.js
│       │   ├── Home.js
│       │   ├── Login.js
│       │   ├── NotFound.js
│       │   ├── Profile.js
│       │   ├── Register.js
│       │   ├── RescheduleAppointment.js
│       │   └── ServiceForm.js
│       ├── services/      # Service modules
│       ├── theme/         # UI theming
│       ├── utils/         # Utility functions
│       ├── App.js         # Main App component
│       ├── index.css      # Global styles
│       └── index.js       # Entry point
└── server/                # Node.js backend
    ├── config/            # Configuration files
    │   └── db.js          # Database configuration
    ├── controllers/       # Route controllers
    │   ├── appointmentController.js
    │   ├── authController.js
    │   ├── availabilityController.js
    │   └── serviceController.js
    ├── middleware/        # Custom middleware
    ├── models/            # Mongoose models
    │   ├── Appointment.js
    │   ├── Availability.js
    │   └── Service.js
    ├── routes/            # API routes
    ├── utils/             # Utility functions
    ├── logs/              # Application logs
    └── server.js          # Server entry point
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/appointment-scheduler.git
   cd appointment-scheduler
   ```

2. Install all dependencies at once:
   ```
   npm run install-all
   ```

   Or install dependencies separately:

   ```
   # Server dependencies
   cd server
   npm install

   # Client dependencies
   cd ../client
   npm install
   ```

3. Create a `.env` file in the server directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/appointment-scheduler
   JWT_SECRET=your_jwt_secret_key_here
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   NODE_ENV=development
   ```

### MongoDB Setup

You have two options for setting up MongoDB:

1. **Local MongoDB**:
   - For detailed instructions, see [LOCAL_MONGODB_SETUP.md](LOCAL_MONGODB_SETUP.md)
   - **Quick Install Scripts**:
     - Windows: Run `install_mongodb_windows.bat` as administrator
     - macOS/Linux: Run `chmod +x install_mongodb_unix.sh && ./install_mongodb_unix.sh`

2. **MongoDB Atlas**:
   - For detailed instructions, see [MONGODB_SETUP.md](MONGODB_SETUP.md)

### Running the Application

Run both the server and client concurrently:
```
npm run dev
```

Or run them separately:

```
# Start the server
cd server
npm run dev

# Start the client
cd client
npm start
```

Open your browser and navigate to `http://localhost:3000`

### Troubleshooting

If you encounter any issues during setup or while running the application, please refer to the [TROUBLESHOOTING.md](TROUBLESHOOTING.md) guide for solutions to common problems.

## Deployment

For detailed deployment instructions, please refer to our [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) that covers:

- Environment setup for production
- MongoDB Atlas setup
- Deployment options:
  - Heroku
  - Render
  - Railway
  - Vercel + Render (Frontend/Backend split)
  - AWS

## User Types

1. **Regular Users**
   - Can book appointments
   - View and manage their appointments
   - Receive notifications

2. **Business Users**
   - Can set their availability
   - Manage services they offer
   - View and manage appointments booked with them

3. **Admin Users**
   - Have access to all features
   - Can manage all users, services, and appointments

## License

This project is licensed under the MIT License - see the LICENSE file for details. 