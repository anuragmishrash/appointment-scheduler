# Appointment Scheduler

A full-stack web application for scheduling and managing appointments. Built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## 🔗 Live Demo

### ✨ [Appointment Scheduler - Live Demo](https://appointment-scheduler-drab.vercel.app/) ✨

Try out the application with our live demo deployed on Vercel!

## Features

### User Management
- **User Authentication**: Secure signup, login, and logout functionality
- **User Profiles**: Manage personal information and preferences
- **Role-Based Access Control**: Different interfaces for regular users, business users, and admins

### Appointment Management
- **Appointment Booking**: Schedule new appointments with businesses
- **Appointment Viewing**: See all your upcoming, past, cancelled, and missed appointments
- **Appointment Details**: View complete information about each appointment
- **Appointment Editing**: Modify appointment details when needed
- **Rescheduling**: Change the date and time of existing appointments
- **Cancellation**: Cancel appointments with automatic notifications
- **Status Tracking**: Monitor appointment status (scheduled, completed, cancelled, missed)
- **Auto-Marking**: System automatically marks appointments as missed when users don't show up

### Calendar & Scheduling
- **Calendar View**: Visual calendar interface for appointment management
- **Availability Management**: Businesses can set their available time slots
- **Real-Time Availability Checking**: Prevents double-booking of time slots
- **Time Zone Support**: Handles appointments across different time zones

### Business Features
- **Business Dashboard**: Dedicated interface for business users
- **Service Management**: Create, edit, and manage services offered
- **Business Booking Dashboard**: View and manage appointments made by customers
- **Business Availability**: Set working hours and available time slots
- **Customer Management**: View customer information and appointment history

### Notifications
- **Email Notifications**: Automated emails for appointment confirmation, reminders, and updates
- **In-App Notifications**: Real-time notifications within the application
- **Appointment Reminders**: Automatic reminders before upcoming appointments
- **Status Updates**: Notifications for appointment status changes
- **Browser Notifications**: Desktop notifications (with permission)

### User Interface
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark/Light Mode**: Customizable theme preferences
- **Material Design**: Modern and intuitive user interface
- **Interactive Elements**: Dynamic components for better user experience
- **Accessibility Features**: Designed with accessibility in mind

## Tech Stack

### Backend
- **Node.js**: JavaScript runtime for the server
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database for data storage
- **Mongoose**: MongoDB object modeling tool
- **JWT**: JSON Web Tokens for secure authentication
- **Nodemailer**: Email sending functionality
- **Node-cron**: Scheduled tasks for reminders and status updates
- **Express Validator**: Input validation and sanitization

### Frontend
- **React.js**: JavaScript library for building user interfaces
- **React Router**: Navigation and routing
- **Material UI**: Component library for consistent design
- **Axios**: HTTP client for API requests
- **React-Toastify**: Toast notifications
- **React-Datepicker**: Date and time selection
- **Context API**: State management
- **LocalStorage**: Persistent client-side storage

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
│       ├── components/    # Reusable components
│       │   ├── common/    # Common UI components
│       │   └── layout/    # Layout components
│       ├── context/       # React context (auth, etc.)
│       ├── pages/         # Page components
│       │   ├── AppointmentDetails.js
│       │   ├── AppointmentForm.js
│       │   ├── AvailabilityForm.js
│       │   ├── BusinessBookingDashboard.js
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
│       │   └── NotificationService.js
│       ├── theme/         # UI theming
│       │   ├── animations.js
│       │   ├── StyledComponents.js
│       │   ├── theme.js
│       │   └── ThemeContext.js
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
    │   └── auth.js        # Authentication middleware
    ├── models/            # Mongoose models
    │   ├── Appointment.js
    │   ├── Availability.js
    │   ├── Service.js
    │   └── User.js
    ├── routes/            # API routes
    │   ├── appointments.js
    │   ├── auth.js
    │   ├── availability.js
    │   ├── services.js
    │   └── users.js
    ├── utils/             # Utility functions
    │   ├── notifications.js
    │   └── seedData.js
    ├── logs/              # Application logs
    └── server.js          # Server entry point
```

## User Flows

### Regular User Flow
1. **Registration/Login**: Create an account or log in
2. **Browse Services**: View available services from businesses
3. **Book Appointment**: Select a service, date, and time
4. **View Dashboard**: See all upcoming and past appointments
5. **Manage Appointments**: Reschedule or cancel as needed
6. **Receive Notifications**: Get reminders about upcoming appointments

### Business User Flow
1. **Registration/Login**: Create a business account or log in
2. **Set Availability**: Define working hours and available time slots
3. **Create Services**: Add services with descriptions, durations, and prices
4. **Manage Bookings**: View and manage customer appointments
5. **Update Status**: Mark appointments as completed or cancelled
6. **View Analytics**: See booking patterns and customer information

## Key Features in Detail

### Appointment Status Management
- **Scheduled**: Default status for new appointments
- **Completed**: Marked by businesses after service delivery
- **Cancelled**: Manually cancelled by users or businesses
- **Missed**: Automatically marked when users don't show up
- **Rescheduled**: Status for appointments that have been moved to a new time

### Automated Processes
- **Missed Appointment Detection**: System automatically marks appointments as missed if users don't attend
- **Reminder System**: Sends notifications before appointments
- **Availability Checking**: Prevents scheduling conflicts
- **Email Notifications**: Automatic emails for important events

### User Dashboard
- **Appointment Cards**: Visual representation of all appointments
- **Filtering**: Filter appointments by status (all, scheduled, cancelled, missed)
- **Quick Actions**: Easily view details or cancel appointments
- **Notifications Center**: Central place for all system notifications

### Business Dashboard
- **Appointment Management**: View and manage all bookings
- **Service Management**: Add, edit, or remove services
- **Availability Settings**: Set working hours and breaks
- **Customer Information**: Access customer details for appointments

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
   TIMEZONE=Your/Timezone  # e.g., 'America/New_York', 'Europe/London', 'Asia/Kolkata'
   ```

   > **Note on Timezones**: The application uses the timezone specified in the `TIMEZONE` environment variable for all date/time operations. If not specified, it defaults to UTC. This is important for appointment scheduling and missed appointment detection. For a list of valid timezone values, refer to the [IANA timezone database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).

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


## User Types

1. **Regular Users**
   - Can book appointments with businesses
   - View and manage their personal appointments
   - Receive notifications for appointments
   - Update their profile information
   - View appointment history

2. **Business Users**
   - Can set their availability schedule
   - Manage services they offer (create, update, delete)
   - View and manage appointments booked with them
   - Mark appointments as completed or cancelled
   - Access customer information for their appointments
   - View their business dashboard with analytics
   - Book appointments as a customer with other businesses

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/user` - Get current user information

### Appointments
- `GET /api/appointments` - Get all user appointments
- `GET /api/appointments/:id` - Get specific appointment
- `POST /api/appointments` - Create a new appointment
- `PUT /api/appointments/:id` - Update an appointment
- `DELETE /api/appointments/:id` - Cancel an appointment

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get specific service
- `POST /api/services` - Create a new service (business only)
- `PUT /api/services/:id` - Update a service (business only)
- `DELETE /api/services/:id` - Delete a service (business only)

### Availability
- `GET /api/availability/:businessId` - Get business availability
- `POST /api/availability` - Set business availability (business only)
- `PUT /api/availability/:id` - Update availability (business only)

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Passwords are securely hashed
- **Protected Routes**: API endpoints are protected based on user roles
- **Input Validation**: All inputs are validated and sanitized

## Authentication System

The application uses JSON Web Tokens (JWT) for authentication. Here's how it works:

1. **Token Generation**: When a user logs in or registers, the server generates a JWT token signed with a secret key.
2. **Token Storage**: The token is stored in the browser's localStorage.
3. **Token Usage**: The token is sent with every API request in the Authorization header.
4. **Token Verification**: The server verifies the token's signature and validity before processing requests.

### Preventing Authentication Issues

To ensure smooth authentication across all devices:

1. **Environment Variables**: 
   - Always set the `JWT_SECRET` environment variable in all environments (development, staging, production)
   - Use the same secret value across all environments to maintain token compatibility

2. **Client-Side Storage**: 
   - If users experience login issues, advise them to clear browser cache and local storage
   - Try using incognito/private browsing mode if persistent issues occur

3. **Token Expiration**: 
   - Tokens expire after 30 days by default
   - Users will need to log in again after expiration

For detailed deployment instructions, including setting up authentication properly, refer to the [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md).

## Future Enhancements

- **Payment Integration**: Online payment processing for appointments
- **Video Conferencing**: Built-in video calls for virtual appointments
- **Mobile App**: Native mobile applications for iOS and Android
- **Advanced Analytics**: More detailed business analytics and reporting
- **Multi-language Support**: Internationalization for global users
- **Customer Reviews**: Rating and review system for businesses

## License

This project is licensed under the MIT License - see the LICENSE file for details. 

## Deployment

This application can be deployed on platforms like Render, Heroku, or Vercel.

### Free Tier Deployment Notes

When deploying on free-tier services (like Render's free tier):

1. **Server Sleep:** Free services typically put your server to sleep after 15 minutes of inactivity.
2. **Cold Starts:** When a user visits after inactivity, there's a 30-60 second delay while the server wakes up.
3. **Keep-Alive:** This app includes built-in mechanisms to prevent spin-down:
   - Internal ping service that runs every 14 minutes
   - User-friendly UI that shows "Server is waking up..." during cold starts
   
4. **For more reliable deployments:**
   - Set up an external ping service using [UptimeRobot](https://uptimerobot.com) (free)
   - Or upgrade to a paid tier ($7+/month on Render) that doesn't sleep

See `TROUBLESHOOTING.md` for detailed information on handling deployment issues. 