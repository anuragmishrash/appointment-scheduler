# Appointment Scheduler Deployment Guide

This guide will walk you through the deployment process for the Appointment Scheduler application.

## Prerequisites

- Node.js v14+ and npm
- MongoDB database (local or Atlas)
- Gmail account for sending notifications (optional)

## Pre-Deployment Verification

Before deploying, run the verification script to check for common configuration issues:

```bash
npm run verify-deployment
```

This script will:
- Check for environment variables in your .env files
- Validate your JWT_SECRET and other critical configurations
- Ensure package.json scripts are properly set up
- Verify API accessibility

Fix any issues reported by the verification script before proceeding with deployment.

## Environment Configuration

### Server Environment Variables

Create a `.env` file in the server directory with the following variables:

```
NODE_ENV=production
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_at_least_32_chars_long
TIMEZONE=your_timezone (e.g., Asia/Kolkata, America/New_York)
EMAIL_USER=your_gmail_email
EMAIL_PASS=your_gmail_app_password
CLIENT_URL=https://your-client-url.com
```

**Important Notes:**
- JWT_SECRET must be at least 32 characters for security
- TIMEZONE should match your local timezone to ensure appointments are displayed correctly
- For EMAIL_PASS, use an App Password from Google, not your account password
- CLIENT_URL can be a comma-separated list of multiple client URLs

### Client Environment Variables

Create a `.env` file in the client directory with:

```
REACT_APP_API_URL=https://your-api-url.com
```

## Deployment Steps

### Backend Deployment (Render.com)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure build command: `cd server && npm install`
4. Configure start command: `cd server && node server.js`
5. Add all environment variables from your `.env` file
6. Deploy the service

### Frontend Deployment (Vercel)

1. Create a new project on Vercel
2. Connect your GitHub repository
3. Configure build settings:
   - Build command: `cd client && npm install && npm run build`
   - Output directory: `client/build`
4. Add your environment variables
5. Deploy the application

## CORS Configuration for Multiple Domains

If your application will be accessed from multiple domains, add them all to the CLIENT_URL environment variable as a comma-separated list:

```
CLIENT_URL=https://domain1.com,https://domain2.com,https://domain3.com
```

The server will automatically add these domains to the allowed CORS origins.

## Post-Deployment Verification

1. Test user registration and login
2. Confirm appointment booking works
3. Verify email notifications are being sent
4. Check timezone handling for appointments

## Avoiding Network Errors

To prevent network errors like the ones you might have experienced:

1. **Proper CORS Configuration**:
   - Ensure all client domains are added to the CLIENT_URL environment variable
   - The server now supports multiple client domains and has improved CORS handling

2. **Authentication Robustness**:
   - The application now cleans localStorage thoroughly before login attempts
   - Error handling has been improved to provide clearer messages

3. **Server Connection Management**:
   - New server status checking component will notify users of API availability
   - Connection retry logic has been added for temporary network issues

4. **Deployment Environment Variables**:
   - Verify all environment variables are properly set in your deployment platform
   - JWT_SECRET must be consistent across all deployments

## Common Issues & Troubleshooting

### Authentication Issues

#### Login/Signup Network Errors
If you encounter network errors while attempting to log in or sign up:

1. **Clear Browser Cache**: Try clearing your browser cache and cookies
2. **Check Browser Storage**: Open DevTools (F12) > Application > Storage > Clear Site Data
3. **Try Different Browsers**: If it works on mobile but not desktop, this confirms a local browser issue
4. **Check CORS Configuration**: Ensure your CLIENT_URL is properly set in server environment variables
5. **JWT Issues**: Verify JWT_SECRET is properly configured and not empty

#### Token Validation Failures
If your login works but you get logged out frequently:

1. **Check JWT_SECRET**: Ensure it's the same across all deployment environments
2. **Timezone Issues**: Make sure TIMEZONE is properly set on the server
3. **localStorage Problems**: Some browsers have restrictive localStorage policies. Try using incognito mode
4. **Network Connectivity**: Intermittent network issues can cause token validation failures

### Appointment Status Issues

If appointments are incorrectly marked as expired or missed:

1. **Timezone Configuration**: Ensure TIMEZONE is set correctly on the server
2. **Server Time Sync**: Verify the server's system time is accurate
3. **Check Browser Timezone**: Ensure your browser's timezone matches your local timezone

### Database Connection Issues

1. **MongoDB URI**: Verify your MONGO_URI is correct and accessible from the deployment environment
2. **Network Restrictions**: Some hosting providers restrict outbound connections
3. **MongoDB Atlas Whitelist**: If using Atlas, ensure your deployment IP is whitelisted

## Support

If you continue to experience issues after trying these troubleshooting steps, please:

1. Check server logs for specific error messages
2. Open an issue on the GitHub repository with detailed information
3. Include environment details (OS, browser version, etc.)

## Security Notes

- Never commit `.env` files or sensitive information to the repository
- Regularly rotate your JWT_SECRET for enhanced security
- Use HTTPS for all production deployments
- Set proper CORS restrictions in production 