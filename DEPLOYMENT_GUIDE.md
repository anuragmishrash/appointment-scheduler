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
   - Set environment variables in the Render dashboard
5. Deploy

### Railway Deployment

1. Create an account at [Railway](https://railway.app/)
2. Create a new project
3. Add your GitHub repository
4. Configure the service:
   - Set environment variables in the Railway dashboard
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
1. Update the server CORS configuration to allow requests from your Vercel frontend domain

### AWS Deployment

For more advanced deployment on AWS:

1. Create an EC2 instance
2. Install Node.js, MongoDB (or use MongoDB Atlas)
3. Clone your repository
4. Set up environment variables
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

## Continuous Integration/Deployment

Consider setting up CI/CD pipelines with GitHub Actions, CircleCI, or the built-in CI/CD tools in your hosting platform. 