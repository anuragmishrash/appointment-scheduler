# Appointment Scheduler Troubleshooting Guide

This guide provides solutions for common issues you might encounter when running or deploying the Appointment Scheduler application.

## Troubleshooting Guide

### Cross-Device Login Issues

If you're experiencing login issues when switching between devices:

1. **Check local storage**: Make sure your browser allows local storage for the application domain
2. **Clear browser cache**: Try clearing your browser cache and cookies
3. **Check for timezone differences**: Different timezones can cause token validation issues
4. **Browser compatibility**: Some older browsers don't support all the features used in the app

### Authentication Issues

If login/signup doesn't persist after some time:

1. **JWT token expiration**: The default token expiration is 24 hours
2. **Server restart**: If the server restarts, it will invalidate sessions if using memory storage
3. **Environment variables**: Make sure JWT_SECRET is properly set in your environment

### Connection Issues

#### "Server is currently unavailable" / "Network error" Messages

If you see these errors on your deployed application (especially on Render):

1. **Free-tier limitations**: Render's free tier spins down services after 15 minutes of inactivity. When a user visits later, the service needs 30-60 seconds to spin up, which can appear as connection errors.

2. **Solutions**:

   - **Wait for spin-up**: If you see "Server is waking up from sleep mode" message, simply wait 30-60 seconds for the server to initialize.
   
   - **Setup a ping service**: The application includes an internal ping mechanism to prevent spin-down, but you can enhance this:
     - Create an account on [UptimeRobot](https://uptimerobot.com) (free)
     - Add a new HTTP monitor for your app's health endpoint (`https://your-app-url.onrender.com/api/health`)
     - Set the monitoring interval to 5 minutes
   
   - **Upgrade to paid tier**: For critical applications, consider upgrading to Render's paid tier ($7+/month) which doesn't spin down

3. **Persistent connection issues**: If issues persist even after the spin-up period:
   - Check Render dashboard for service logs and errors
   - Ensure your MongoDB connection string is correct
   - Check if you've reached free tier resource limits

### Database Issues

1. **Connection refused**: Verify MongoDB is running and accessible
2. **Authentication failed**: Check database credentials
3. **Timeout errors**: Could indicate network issues or overloaded database

### Other Common Issues

1. **CORS errors**: Check that your frontend origin is properly configured in the CORS settings
2. **Missing dependencies**: Run `npm install` in both client and server directories
3. **Port conflicts**: Make sure the required ports (5000 for server, 3000 for client) are available
4. **Memory limitations**: Free tier hosting often has memory constraints 