# Deployment Guide for Appointment Scheduler

This guide provides step-by-step instructions for deploying the Appointment Scheduler application to various hosting platforms.

## Table of Contents
- [Environment Setup](#environment-setup)
- [MongoDB Atlas Setup](#mongodb-atlas-setup)
- [Deployment Options](#deployment-options)
  - [Heroku Deployment](#heroku-deployment)
  - [Render Deployment](#render-deployment)
  - [Railway Deployment](#railway-deployment)
  - [Vercel + Render Deployment](#vercel--render-deployment)
  - [AWS Deployment](#aws-deployment)

## Environment Setup

Before deploying, you need to set up environment variables for production:

```
# Server Configuration
PORT=5000
NODE_ENV=production
TIMEZONE=Your/Timezone  # e.g., 'America/New_York', 'Europe/London', 'Asia/Kolkata'

# MongoDB Configuration 
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/appointment-scheduler

# JWT Configuration
JWT_SECRET=your_strong_random_secret_key_here

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password
```

## MongoDB Atlas Setup

For production, it's recommended to use MongoDB Atlas:

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Set up database access (user/password)
4. Set up network access (IP Whitelist)
5. Get your connection string and replace `username`, `password`, and `cluster` with your information

## Deployment Options

### Heroku Deployment

1. Install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
2. Login to Heroku:
   ```
   heroku login
   ```
3. Create a new Heroku app:
   ```
   heroku create your-app-name
   ```
4. Add MongoDB add-on or use your MongoDB Atlas URI:
   ```
   heroku addons:create mongolab
   ```
   Or set your MongoDB Atlas URI:
   ```
   heroku config:set MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/appointment-scheduler
   ```
5. Set other environment variables:
   ```
   heroku config:set JWT_SECRET=your_strong_random_secret_key_here
   heroku config:set EMAIL_USER=your_email@gmail.com
   heroku config:set EMAIL_PASS=your_app_specific_password
   heroku config:set NODE_ENV=production
   heroku config:set TIMEZONE=America/New_York  # Set your application timezone
   ```
6. Push to Heroku:
   ```
   git push heroku main
   ```

### Render Deployment

1. Create an account at [Render](https://render.com/)
2. Create a new Web Service for your backend
3. Connect your GitHub repository
4. Configure the service:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Set environment variables in the Render dashboard:
     - `NODE_ENV`: `production`
     - `MONGO_URI`: Your MongoDB connection string
     - `JWT_SECRET`: Your JWT secret
     - `EMAIL_USER`: Your email address
     - `EMAIL_PASS`: Your email password
     - `TIMEZONE`: Your timezone (e.g., `America/New_York`)
5. Deploy

### Railway Deployment

1. Create an account at [Railway](https://railway.app/)
2. Create a new project
3. Add your GitHub repository
4. Configure the service:
   - Set environment variables in the Railway dashboard:
     - `NODE_ENV`: `production`
     - `MONGO_URI`: Your MongoDB connection string
     - `JWT_SECRET`: Your JWT secret
     - `EMAIL_USER`: Your email address
     - `EMAIL_PASS`: Your email password
     - `TIMEZONE`: Your timezone (e.g., `America/New_York`)
5. Deploy

### Vercel + Render Deployment (Frontend/Backend Split)

#### Frontend Deployment with Vercel

1. Create an account at [Vercel](https://vercel.com/)
2. Import your repository
3. Set the root directory to `client`
4. Set environment variables:
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com
   ```
5. Deploy

#### Backend Deployment with Render

Follow the Render deployment steps above, but make sure to:
1. Set the `TIMEZONE` environment variable to match your primary user base
2. Update the server CORS configuration to allow requests from your Vercel frontend domain

### AWS Deployment

For more advanced deployment on AWS:

1. Create an EC2 instance
2. Install Node.js, MongoDB (or use MongoDB Atlas)
3. Clone your repository
4. Set up environment variables in your .env file or system environment:
   ```
   NODE_ENV=production
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email
   EMAIL_PASS=your_email_password
   TIMEZONE=your_timezone  # Critical for appointment scheduling
   ```
5. Set up a process manager like PM2:
   ```
   npm install -g pm2
   pm2 start server/server.js
   ```
6. Configure Nginx as a reverse proxy to your Node.js app
7. Set up SSL with Let's Encrypt

## Production Checks Before Deployment

1. Ensure all sensitive data is in environment variables
2. Set `NODE_ENV=production`
3. Build the React app: `npm run build`
4. Test the production build locally

## Important Timezone Configuration

The application uses the timezone specified in the `TIMEZONE` environment variable for all date/time operations. This is critical for:

- Correctly filtering available time slots
- Properly marking appointments as missed
- Sending timely reminders to users

**For each deployment platform, make sure to set the TIMEZONE environment variable:**

- **Heroku**: `heroku config:set TIMEZONE=America/New_York`
- **Render**: Add `TIMEZONE` in the Environment Variables section
- **Railway**: Add `TIMEZONE` in the Variables section
- **Vercel**: Add `TIMEZONE` in the Environment Variables section
- **AWS**: Add `TIMEZONE` to your environment configuration

If not specified, the application defaults to UTC, which may cause issues with appointment scheduling and missed appointment detection if your users are in different timezones.

## Continuous Integration/Deployment