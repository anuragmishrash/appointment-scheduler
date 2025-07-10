# Appointment Scheduler Troubleshooting Guide

This guide provides solutions for common issues you might encounter when running or deploying the Appointment Scheduler application.

## Authentication Issues

### Network Error During Login/Signup

**Problem**: Login/signup fails with network errors on some devices (like laptops) but works on others (like mobile phones).

**Solution**:

1. **Clear Browser Storage**:
   - Open browser DevTools (F12)
   - Go to Application > Storage > Clear Site Data
   - Try logging in again

2. **Try Incognito/Private Mode**:
   - Open a private/incognito window
   - Try logging in from there

3. **Different Browser**:
   - If it works on mobile but not desktop, try a different browser
   - This often helps bypass browser-specific caching issues

4. **After Mobile Login Success**:
   - If you successfully login from your mobile device, try your desktop again
   - The successful authentication might clear server-side session conflicts

5. **Check Network Connection**:
   - Ensure stable internet connection
   - Some firewalls or network security tools can interfere with authentication requests

### JWT Token Issues

**Problem**: Authentication initially works but fails after some time.

**Solution**:

1. **Check Server Environment Variables**:
   - Verify JWT_SECRET is properly set and not empty
   - Ensure it's at least 32 characters long
   - Make sure it's consistent across all deployment environments

2. **Server Timezone Configuration**:
   - Confirm TIMEZONE environment variable is set correctly
   - Token expiration is time-sensitive

3. **Browser Storage Issues**:
   - Some browsers restrict localStorage in certain contexts
   - Try using sessionStorage instead if persistent issues occur

## Appointment Status Issues

### Appointments Incorrectly Marked as Expired or Missed

**Problem**: Appointments are being marked as expired or missed even though they shouldn't be.

**Solution**:

1. **Timezone Settings**:
   - Check server's TIMEZONE environment variable
   - Ensure browser timezone matches your local timezone
   - Verify appointment times are interpreted correctly

2. **Server Time**:
   - Make sure server's system clock is accurate
   - NTP sync issues can cause timing problems

3. **Grace Period Settings**:
   - The system allows a 15-minute grace period for missed appointments
   - Check if this setting needs adjustment for your use case

## Database Connection Issues

### MongoDB Connection Failures

**Problem**: Application fails to connect to the database.

**Solution**:

1. **Check MongoDB URI**:
   - Verify the connection string is correct
   - Ensure credentials are valid
   - Test connection with MongoDB Compass

2. **Network Access**:
   - If using MongoDB Atlas, check IP whitelist
   - Some hosting providers restrict outbound connections

3. **MongoDB Version Compatibility**:
   - Ensure your MongoDB version is compatible with the drivers

## Email Notification Issues

### Notifications Not Being Sent

**Problem**: Appointment reminders or confirmation emails are not being delivered.

**Solution**:

1. **Email Credentials**:
   - Check EMAIL_USER and EMAIL_PASS environment variables
   - For Gmail, ensure you're using an App Password, not account password

2. **Email Service Status**:
   - Gmail and other providers may have sending limits
   - Check for temporary service disruptions

3. **Spam Filters**:
   - Emails might be delivered to spam folders
   - Check spam/junk folders for missing emails

## Cross-Browser/Cross-Device Issues

### Interface Rendering Problems

**Problem**: UI elements don't appear correctly on certain browsers/devices.

**Solution**:

1. **Browser Compatibility**:
   - The app is optimized for Chrome, Firefox, Safari, and Edge
   - Try updating your browser to the latest version

2. **Mobile Responsiveness**:
   - Some views may render differently on mobile
   - Use landscape orientation for complex interfaces

3. **Clear Cache**:
   - Force refresh with Ctrl+F5 or Cmd+Shift+R
   - Clear browser cache completely for persistent issues

## Development Environment Issues

### Hot Reloading Not Working

**Problem**: Changes to code aren't reflected in the development environment.

**Solution**:

1. **Restart Development Server**:
   - Stop the server (Ctrl+C)
   - Restart with `npm start`

2. **Check Dependencies**:
   - Run `npm install` to ensure all dependencies are up to date
   - Check for conflicting package versions

3. **File Watching Limits**:
   - On Linux systems, you might need to increase file watching limits
   - Run `echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p`

## Still Having Issues?

If you've tried these solutions and are still experiencing problems:

1. Check the server logs for detailed error messages
2. Consult the GitHub issues page to see if others have reported similar problems
3. Open a new issue with detailed information about the problem, including:
   - Your environment (OS, browser version, Node.js version)
   - Steps to reproduce the issue
   - Error messages (from console or logs)
   - Screenshots if applicable 