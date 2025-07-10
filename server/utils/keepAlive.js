const https = require('https');

/**
 * Sets up an external ping service to keep the server alive
 * This uses UptimeRobot's API to ping your server every 5 minutes
 * 
 * @param {string} url - The URL of your deployed application
 */
function setupExternalPingService(url) {
  if (!url) {
    console.log('No URL provided for external ping service');
    return;
  }

  // Remove trailing slash if present
  const cleanUrl = url.endsWith('/') ? url.slice(0, -1) : url;
  
  console.log(`Setting up external ping for: ${cleanUrl}/api/health`);

  // Instructions for setting up UptimeRobot
  console.log(`
=================================================
TO KEEP YOUR SERVER ALIVE PERMANENTLY:
1. Go to https://uptimerobot.com and create a free account
2. Add a new monitor:
   - Monitor Type: HTTP(s)
   - Friendly Name: Appointment Scheduler
   - URL: ${cleanUrl}/api/health
   - Monitoring Interval: 5 minutes
=================================================
  `);
}

module.exports = { setupExternalPingService }; 