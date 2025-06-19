# Troubleshooting Guide

This guide addresses common issues you might encounter when setting up and running the Appointment Scheduler application.

## MongoDB Connection Issues

### Error: ECONNREFUSED ::1:27017

**Problem**: The server cannot connect to the MongoDB database.

**Solutions**:

1. **Check if MongoDB is running**:
   - Windows: Open Task Manager and look for MongoDB process
   - macOS: Run `brew services list` to check if MongoDB is running
   - Linux: Run `sudo systemctl status mongodb` or `sudo systemctl status mongod`

2. **Start MongoDB if it's not running**:
   - Windows: Start MongoDB service from Services (Win+R → services.msc)
   - macOS: Run `brew services start mongodb-community`
   - Linux: Run `sudo systemctl start mongodb` or `sudo systemctl start mongod`

3. **Use MongoDB Atlas instead**:
   - Follow the instructions in [MONGODB_SETUP.md](MONGODB_SETUP.md)
   - Update your `.env` file with the Atlas connection string

## React Client Issues

### Error: 'react-scripts' is not recognized

**Problem**: The React client cannot start because react-scripts is not installed.

**Solutions**:

1. **Install react-scripts**:
   ```
   cd client
   npm install react-scripts
   ```

2. **Reinstall all client dependencies**:
   ```
   cd client
   rm -rf node_modules
   npm install
   ```

### Error: Port 3000 is already in use

**Problem**: Another application is using port 3000.

**Solutions**:

1. **Kill the process using port 3000**:
   - Windows: `netstat -ano | findstr :3000` then `taskkill /PID <PID> /F`
   - macOS/Linux: `lsof -i :3000` then `kill -9 <PID>`

2. **Use a different port**:
   - Create a `.env` file in the client directory with:
     ```
     PORT=3001
     ```

## Server Issues

### Error: Port 5000 is already in use

**Problem**: Another application is using port 5000.

**Solutions**:

1. **Kill the process using port 5000**:
   - Windows: `netstat -ano | findstr :5000` then `taskkill /PID <PID> /F`
   - macOS/Linux: `lsof -i :5000` then `kill -9 <PID>`

2. **Use a different port**:
   - Update the `PORT` variable in `server/.env` file

### Error: Module not found

**Problem**: A required Node.js module is missing.

**Solution**:
```
cd server
npm install
```

## CORS Issues

**Problem**: The client cannot connect to the server due to CORS errors.

**Solutions**:

1. **Check server CORS configuration**:
   - Make sure the server's CORS configuration allows requests from the client's origin
   - Verify that `app.use(cors())` is present in `server.js`

2. **Check API endpoint URLs**:
   - Make sure the client is using the correct server URL
   - Check for typos in API endpoint paths

## JWT Authentication Issues

**Problem**: Authentication errors like "Invalid token" or "Token expired".

**Solutions**:

1. **Check JWT secret**:
   - Make sure the `JWT_SECRET` in `server/.env` is set correctly

2. **Clear browser storage**:
   - Open browser developer tools → Application → Storage → Clear site data

## Still Having Issues?

If you're still experiencing problems after trying these solutions:

1. Check the server logs for more detailed error messages
2. Make sure all environment variables are set correctly
3. Try running the client and server in separate terminals to see individual error messages
4. Create an issue on the project's GitHub repository with details about your problem 