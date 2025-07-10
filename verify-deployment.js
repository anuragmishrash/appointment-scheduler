/**
 * Deployment Verification Script
 * This script checks for common configuration issues before deployment
 */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const axios = require('axios');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

console.log(`${colors.cyan}${colors.bright}=== Deployment Verification Tool ====${colors.reset}\n`);
console.log(`This script will check for common configuration issues before deployment.\n`);

// Track issues found
let issuesFound = 0;
let warningsFound = 0;

// Check server .env file
const serverEnvPath = path.join(__dirname, 'server', '.env');
if (fs.existsSync(serverEnvPath)) {
  console.log(`${colors.green}✓ Server .env file found${colors.reset}`);
  
  // Load and validate .env contents
  const serverEnv = dotenv.parse(fs.readFileSync(serverEnvPath));
  
  // Check critical environment variables
  console.log('\nChecking server environment variables:');
  
  // Check JWT_SECRET
  if (!serverEnv.JWT_SECRET) {
    console.log(`${colors.red}✗ JWT_SECRET is missing${colors.reset}`);
    issuesFound++;
  } else if (serverEnv.JWT_SECRET.length < 32) {
    console.log(`${colors.yellow}⚠ JWT_SECRET is less than 32 characters long${colors.reset}`);
    warningsFound++;
  } else {
    console.log(`${colors.green}✓ JWT_SECRET is properly configured${colors.reset}`);
  }
  
  // Check MONGO_URI
  if (!serverEnv.MONGO_URI) {
    console.log(`${colors.red}✗ MONGO_URI is missing${colors.reset}`);
    issuesFound++;
  } else {
    console.log(`${colors.green}✓ MONGO_URI is configured${colors.reset}`);
  }
  
  // Check PORT
  if (!serverEnv.PORT) {
    console.log(`${colors.yellow}⚠ PORT is not set, will default to 5000${colors.reset}`);
    warningsFound++;
  } else {
    console.log(`${colors.green}✓ PORT is set to ${serverEnv.PORT}${colors.reset}`);
  }
  
  // Check NODE_ENV
  if (!serverEnv.NODE_ENV) {
    console.log(`${colors.yellow}⚠ NODE_ENV is not set, will default to development${colors.reset}`);
    warningsFound++;
  } else if (serverEnv.NODE_ENV !== 'production') {
    console.log(`${colors.yellow}⚠ NODE_ENV is set to ${serverEnv.NODE_ENV}, not production${colors.reset}`);
    warningsFound++;
  } else {
    console.log(`${colors.green}✓ NODE_ENV is set to production${colors.reset}`);
  }
  
  // Check CLIENT_URL
  if (!serverEnv.CLIENT_URL) {
    console.log(`${colors.yellow}⚠ CLIENT_URL is not set, CORS might have issues${colors.reset}`);
    warningsFound++;
  } else {
    console.log(`${colors.green}✓ CLIENT_URL is configured${colors.reset}`);
  }
  
  // Check TIMEZONE
  if (!serverEnv.TIMEZONE && !serverEnv.TZ) {
    console.log(`${colors.yellow}⚠ TIMEZONE/TZ is not set, will default to UTC${colors.reset}`);
    warningsFound++;
  } else {
    console.log(`${colors.green}✓ TIMEZONE is set to ${serverEnv.TIMEZONE || serverEnv.TZ}${colors.reset}`);
  }
  
} else {
  console.log(`${colors.yellow}⚠ Server .env file not found at ${serverEnvPath}${colors.reset}`);
  console.log(`${colors.yellow}Make sure to configure environment variables in your deployment platform${colors.reset}`);
  warningsFound++;
}

// Check client environment
const clientEnvPath = path.join(__dirname, 'client', '.env');
if (fs.existsSync(clientEnvPath)) {
  console.log(`\n${colors.green}✓ Client .env file found${colors.reset}`);
  
  // Load client env
  const clientEnv = dotenv.parse(fs.readFileSync(clientEnvPath));
  
  // Check REACT_APP_API_URL
  if (!clientEnv.REACT_APP_API_URL) {
    console.log(`${colors.yellow}⚠ REACT_APP_API_URL is not set, will use default API URL${colors.reset}`);
    warningsFound++;
  } else {
    console.log(`${colors.green}✓ REACT_APP_API_URL is set to ${clientEnv.REACT_APP_API_URL}${colors.reset}`);
  }
} else {
  console.log(`\n${colors.yellow}⚠ Client .env file not found at ${clientEnvPath}${colors.reset}`);
  console.log(`${colors.yellow}Make sure to configure environment variables in your deployment platform${colors.reset}`);
  warningsFound++;
}

// Check API accessibility if possible
console.log('\nChecking API accessibility:');

const apiUrls = [
  'https://appointment-scheduler-ah4f.onrender.com',
  'http://localhost:5000'
];

// Function to check if an API is accessible
const checkApiAccessibility = async (url) => {
  try {
    const response = await axios.get(`${url}/`, { timeout: 5000 });
    if (response.status === 200) {
      console.log(`${colors.green}✓ API at ${url} is accessible${colors.reset}`);
      return true;
    } else {
      console.log(`${colors.yellow}⚠ API at ${url} returned status ${response.status}${colors.reset}`);
      warningsFound++;
      return false;
    }
  } catch (error) {
    console.log(`${colors.yellow}⚠ API at ${url} is not accessible: ${error.message}${colors.reset}`);
    warningsFound++;
    return false;
  }
};

// Check all API URLs
(async () => {
  let apiAccessible = false;
  
  for (const url of apiUrls) {
    const accessible = await checkApiAccessibility(url);
    if (accessible) {
      apiAccessible = true;
    }
  }
  
  if (!apiAccessible) {
    console.log(`${colors.yellow}⚠ None of the APIs are accessible. Make sure your server is running.${colors.reset}`);
    warningsFound++;
  }
  
  // Check package.json configurations
  console.log('\nChecking package.json configurations:');
  
  const rootPackageJsonPath = path.join(__dirname, 'package.json');
  if (fs.existsSync(rootPackageJsonPath)) {
    const rootPackageJson = JSON.parse(fs.readFileSync(rootPackageJsonPath, 'utf8'));
    
    // Check if build script exists
    if (!rootPackageJson.scripts || !rootPackageJson.scripts.build) {
      console.log(`${colors.yellow}⚠ Root package.json does not have a build script${colors.reset}`);
      warningsFound++;
    } else {
      console.log(`${colors.green}✓ Root package.json has a build script${colors.reset}`);
    }
    
    // Check if start script exists
    if (!rootPackageJson.scripts || !rootPackageJson.scripts.start) {
      console.log(`${colors.red}✗ Root package.json does not have a start script${colors.reset}`);
      issuesFound++;
    } else {
      console.log(`${colors.green}✓ Root package.json has a start script${colors.reset}`);
    }
  } else {
    console.log(`${colors.red}✗ Root package.json not found${colors.reset}`);
    issuesFound++;
  }
  
  // Check client package.json
  const clientPackageJsonPath = path.join(__dirname, 'client', 'package.json');
  if (fs.existsSync(clientPackageJsonPath)) {
    const clientPackageJson = JSON.parse(fs.readFileSync(clientPackageJsonPath, 'utf8'));
    
    // Check if build script exists in client
    if (!clientPackageJson.scripts || !clientPackageJson.scripts.build) {
      console.log(`${colors.red}✗ Client package.json does not have a build script${colors.reset}`);
      issuesFound++;
    } else {
      console.log(`${colors.green}✓ Client package.json has a build script${colors.reset}`);
    }
  } else {
    console.log(`${colors.red}✗ Client package.json not found${colors.reset}`);
    issuesFound++;
  }
  
  // Summary of findings
  console.log(`\n${colors.cyan}${colors.bright}=== Verification Summary ====${colors.reset}`);
  if (issuesFound === 0 && warningsFound === 0) {
    console.log(`\n${colors.green}${colors.bright}✓ No issues or warnings found. Your application is ready for deployment!${colors.reset}\n`);
  } else {
    console.log(`\n${colors.red}${colors.bright}Issues found: ${issuesFound}${colors.reset}`);
    console.log(`${colors.yellow}${colors.bright}Warnings found: ${warningsFound}${colors.reset}\n`);
    
    if (issuesFound > 0) {
      console.log(`${colors.red}${colors.bright}! Please fix the issues before deploying.${colors.reset}`);
    } else {
      console.log(`${colors.yellow}${colors.bright}! You can deploy, but consider addressing the warnings.${colors.reset}`);
    }
  }
  
  console.log('\nHappy deploying! 🚀\n');
})(); 