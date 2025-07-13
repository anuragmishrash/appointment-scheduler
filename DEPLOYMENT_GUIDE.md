# Appointment Scheduler Deployment Guide

This guide will help you deploy the Appointment Scheduler application to a hosting service like Render.com or Heroku.

## Preparing for Deployment

1. **Environment Variables**
   - Create a `.env` file in the server directory with the following variables:
     ```
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret_key
     PORT=5000
     NODE_ENV=production
     ```
   - Make sure to use strong, random values for JWT_SECRET
   - For MongoDB, use MongoDB Atlas for a cloud-hosted database

2. **Build the Client**
   - Navigate to the client directory
   - Run `npm run build` to create an optimized production build
   - The build files will be in the `client/build` directory

## Deployment Options

### Option 1: Render.com

1. **Create a Web Service**
   - Sign up for a Render.com account
   - Click "New +" and select "Web Service"
   - Connect your GitHub repository
   - Configure the service:
     - Name: `appointment-scheduler`
     - Environment: `Node`
     - Build Command: `npm install && cd client && npm install && npm run build`
     - Start Command: `cd server && npm start`
     - Set the Environment Variables (from your .env file)

2. **Free Tier Considerations**
   - Free tier services on Render will "spin down" after periods of inactivity
   - This causes a cold start delay (30-60 seconds) when the first request hits the server
   - The app has been enhanced to detect and handle this with the following features:
     - Server health checking
     - "Server waking up" notifications
     - Auto-retry logic

3. **Preventing Cold Starts**
   - To keep your server from spinning down (optional):
     - Set up a free service like UptimeRobot (https://uptimerobot.com)
     - Configure it to ping your `/api/health` endpoint every 5-10 minutes
     - This will keep your service active and prevent cold starts

4. **Configure Custom Domain** (Optional)
   - In the Render dashboard, go to your web service
   - Click on "Settings" and then "Custom Domains"
   - Follow the instructions to add and verify your domain

### Option 2: Heroku

1. **Create a Heroku App**
   - Sign up for a Heroku account
   - Install the Heroku CLI: `npm install -g heroku`
   - Login to Heroku: `heroku login`
   - Create a new app: `heroku create appointment-scheduler`
   - Set environment variables: `heroku config:set JWT_SECRET=your_secret_key`

2. **Deploy the Application**
   - Add the Heroku remote: `heroku git:remote -a your-app-name`
   - Push to Heroku: `git push heroku main`

3. **Configure MongoDB Add-on**
   - Add MongoDB: `heroku addons:create mongodb:sandbox`
   - Get connection string: `heroku config:get MONGODB_URI`

### Option 3: Docker Deployment

1. **Build Docker Image**
   - A Dockerfile is provided in the root directory
   - Build the image: `docker build -t appointment-scheduler .`
   - Run locally: `docker run -p 5000:5000 appointment-scheduler`

2. **Deploy to Docker Platforms**
   - Push to Docker Hub: `docker push yourusername/appointment-scheduler`
   - Deploy to container services like AWS ECS or DigitalOcean App Platform

## Post-Deployment

1. **Verify Deployment**
   - Visit your deployed application
   - Test user registration, login, and appointment booking

2. **Monitor Application**
   - Use Render's or Heroku's built-in logs to monitor the application
   - Set up error tracking with a service like Sentry (optional)

3. **Database Backups**
   - Set up regular database backups for MongoDB Atlas
   - Download backups periodically for local storage

## Troubleshooting

If you encounter issues during or after deployment, please refer to the [TROUBLESHOOTING.md](TROUBLESHOOTING.md) file.

Common deployment issues:
- JWT_SECRET not set correctly
- MongoDB connection issues
- CORS errors
- Server cold start delays on free tiers

## Keeping the Server Awake

To avoid the initial loading delay from server sleeping:

1. **Implement Server Pinging**
   - Create a script that pings your application regularly
   - Use a free service like UptimeRobot (https://uptimerobot.com)
   - Configure it to ping `/api/health` every 5-10 minutes

2. **Use a Keep-Alive Endpoint**
   - The application includes a `/api/health` endpoint
   - This endpoint is lightweight and perfect for pinging

3. **Consider Paid Tier**
   - For production applications, consider upgrading to a paid tier
   - This will eliminate the spin-down behavior and provide better performance 