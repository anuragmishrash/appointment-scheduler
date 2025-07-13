# Appointment Scheduler - Troubleshooting Guide

## Common Issues and Solutions

### Dashboard Loading Indefinitely

**Symptoms:** 
- Dashboard shows a loading spinner and never loads content
- Works on another device but not on your current one
- Works after visiting from another device

**Possible Causes and Solutions:**

1. **Server Cold Start Delay:**
   - The free tier on Render.com puts servers to sleep after inactivity
   - First request may take 30-60 seconds to wake the server
   - **Solution:** Wait for the server to wake up. The app now displays a "Server is waking up" message during this process.

2. **Authentication Token Issues:**
   - Corrupt or expired token in browser storage
   - **Solution:** Try logging out and logging back in. Or clear your browser's local storage:
     - Chrome: Settings → Privacy and Security → Clear browsing data → Check "Cookies and site data"
     - Firefox: Settings → Privacy & Security → Cookies and Site Data → Clear Data

3. **Browser Cache/Cookie Issues:**
   - Outdated cached API responses
   - **Solution:** Try hard-refreshing your browser:
     - Windows: Ctrl+F5 or Ctrl+Shift+R
     - Mac: Command+Shift+R

4. **Network Connectivity:**
   - Firewalls or network restrictions blocking API requests
   - **Solution:** Check your network connection, try on a different network, or disable VPN/proxy if using one.

### Login/Registration Problems

1. **Failed Login Attempts:**
   - "Invalid email or password" despite using correct credentials
   - **Solution:** Ensure caps lock is off, check for typos, and try resetting your password if needed.

2. **Registration Not Working:**
   - Error messages when trying to create an account
   - **Solution:** Ensure all required fields are filled in correctly. Email may already be registered.

3. **Session Expired Messages:**
   - Frequent "Session expired" notices
   - **Solution:** This could indicate server-side issues. Try clearing your browser cache and cookies, then log in again.

### Appointment Booking Issues

1. **Cannot See Available Time Slots:**
   - Calendar shows no available slots
   - **Solution:** Check if you're looking at the correct date. The business may not have set availability for the selected date.

2. **Error When Booking Appointment:**
   - Errors when trying to schedule an appointment
   - **Solution:** Ensure you've selected both a service and a valid time slot. Try refreshing the page.

3. **Appointments Not Showing in Dashboard:**
   - Recently booked appointments not appearing
   - **Solution:** Try refreshing the page or logging out and back in.

### Mobile vs. Desktop Differences

If you notice the application works on mobile but not on desktop (or vice versa):

1. **Browser Compatibility:**
   - Try using a different browser on the problematic device
   - Ensure your browser is updated to the latest version

2. **Local Storage Differences:**
   - Mobile and desktop browsers have separate storage
   - **Solution:** Log out and log back in on each device independently

3. **Connection Differences:**
   - Mobile might be using cellular data while desktop uses Wi-Fi
   - **Solution:** Try connecting both devices to the same network

## Reporting Issues

If you've tried the solutions above and are still experiencing problems, please report the issue with:

1. The specific error message (if any)
2. Steps to reproduce the problem
3. Your browser and device information
4. Screenshots if possible

Submit issues through the project's issue tracker or contact support.

## Server Status

The application now includes a server status indicator that will show when there are connection issues. If you see a "Server is waking up" message, please be patient as the server may take up to 60 seconds to become responsive. 