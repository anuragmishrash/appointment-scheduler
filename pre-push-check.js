/**
 * Pre-Push Check Script
 * Run this script before pushing your code to GitHub to verify it's ready for deployment
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

console.log(`${colors.cyan}${colors.bright}=== Pre-Push Check ====${colors.reset}\n`);
console.log('Running checks before pushing to GitHub...\n');

// Track issues
let issuesFound = 0;

// Helper function to run a command and return the output
const runCommand = (command, errorMessage) => {
  try {
    return execSync(command, { encoding: 'utf8' });
  } catch (error) {
    console.error(`${colors.red}${errorMessage}${colors.reset}`);
    console.error(`${colors.red}${error.message}${colors.reset}`);
    issuesFound++;
    return '';
  }
};

// Check for uncommitted changes
console.log(`${colors.cyan}Checking for uncommitted changes...${colors.reset}`);
const gitStatus = runCommand('git status --porcelain', 'Failed to check git status.');

if (gitStatus.trim()) {
  console.log(`${colors.yellow}⚠ You have uncommitted changes:${colors.reset}`);
  console.log(gitStatus);
  issuesFound++;
} else {
  console.log(`${colors.green}✓ No uncommitted changes found.${colors.reset}`);
}

// Check for .env files that shouldn't be committed
console.log(`\n${colors.cyan}Checking for .env files...${colors.reset}`);
const envFiles = [
  path.join(__dirname, '.env'),
  path.join(__dirname, 'server', '.env'),
  path.join(__dirname, 'client', '.env')
];

const gitIgnore = fs.existsSync(path.join(__dirname, '.gitignore')) 
  ? fs.readFileSync(path.join(__dirname, '.gitignore'), 'utf8')
  : '';

let envFilesInGitignore = gitIgnore.includes('.env');

envFiles.forEach(file => {
  if (fs.existsSync(file)) {
    if (!envFilesInGitignore) {
      console.log(`${colors.yellow}⚠ Found .env file at ${file} but .env is not in .gitignore!${colors.reset}`);
      issuesFound++;
    } else {
      console.log(`${colors.green}✓ Found .env file at ${file} (ignored by git).${colors.reset}`);
    }
  }
});

if (!envFilesInGitignore) {
  console.log(`${colors.yellow}⚠ .env files are not ignored in .gitignore. Consider adding them to prevent exposing secrets.${colors.reset}`);
  issuesFound++;
} else {
  console.log(`${colors.green}✓ .env files are properly ignored in .gitignore.${colors.reset}`);
}

// Check for production hardcoded values
console.log(`\n${colors.cyan}Checking for hardcoded API URLs...${colors.reset}`);

// Files to check for hardcoded URLs
const filesToCheck = [
  { path: path.join(__dirname, 'client', 'src', 'api', 'axios.js'), name: 'client/src/api/axios.js' },
  { path: path.join(__dirname, 'server', 'server.js'), name: 'server/server.js' }
];

let hardcodedUrlsFound = false;

filesToCheck.forEach(file => {
  if (fs.existsSync(file.path)) {
    const content = fs.readFileSync(file.path, 'utf8');
    
    // Check for localhost without environment variable fallback
    if (content.includes('localhost') && !content.includes('process.env')) {
      console.log(`${colors.yellow}⚠ Found hardcoded localhost in ${file.name} without environment variable fallback.${colors.reset}`);
      hardcodedUrlsFound = true;
      issuesFound++;
    }
    
    // Check for hardcoded production URLs that should be environment variables
    const productionUrls = [
      'appointment-scheduler-ah4f.onrender.com',
      'appointment-scheduler-client.vercel.app'
    ];
    
    productionUrls.forEach(url => {
      if (content.includes(url) && !content.includes('process.env.REACT_APP_API_URL') && !content.includes('process.env.CLIENT_URL')) {
        console.log(`${colors.yellow}⚠ Found hardcoded production URL ${url} in ${file.name} that should use environment variables.${colors.reset}`);
        hardcodedUrlsFound = true;
        issuesFound++;
      }
    });
  }
});

if (!hardcodedUrlsFound) {
  console.log(`${colors.green}✓ No problematic hardcoded URLs found.${colors.reset}`);
}

// Check for sensitive information
console.log(`\n${colors.cyan}Checking for sensitive information...${colors.reset}`);

const sensitivePatterns = [
  { pattern: /password\s*=\s*['"][^'"]*['"]/, description: 'Hardcoded password' },
  { pattern: /secret\s*=\s*['"][^'"]*['"]/, description: 'Hardcoded secret' },
  { pattern: /api[_-]?key\s*=\s*['"][^'"]*['"]/, description: 'Hardcoded API key' },
  { pattern: /mongodb(\+srv)?:\/\/[^@]+:[^@]+@/, description: 'MongoDB connection string with credentials' },
  { pattern: /JWT_SECRET\s*=\s*['"][^'"]*['"]/, description: 'Hardcoded JWT secret' }
];

const dirsToCheck = [
  path.join(__dirname, 'client', 'src'),
  path.join(__dirname, 'server')
];

let sensitiveInfoFound = false;

const checkFileForSensitiveInfo = (filePath) => {
  if (filePath.includes('node_modules') || filePath.includes('.git') || filePath.includes('.env')) {
    return;
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    sensitivePatterns.forEach(({ pattern, description }) => {
      if (pattern.test(content)) {
        console.log(`${colors.yellow}⚠ Found potential ${description} in ${filePath}${colors.reset}`);
        sensitiveInfoFound = true;
        issuesFound++;
      }
    });
  } catch (error) {
    // Skip files that can't be read as text
  }
};

const walkDir = (dir) => {
  try {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      
      if (fs.statSync(filePath).isDirectory()) {
        walkDir(filePath);
      } else {
        checkFileForSensitiveInfo(filePath);
      }
    });
  } catch (error) {
    console.error(`${colors.red}Error reading directory ${dir}: ${error.message}${colors.reset}`);
  }
};

dirsToCheck.forEach(dir => {
  if (fs.existsSync(dir)) {
    walkDir(dir);
  }
});

if (!sensitiveInfoFound) {
  console.log(`${colors.green}✓ No sensitive information found in code files.${colors.reset}`);
}

// Summary
console.log(`\n${colors.cyan}${colors.bright}=== Check Summary ====${colors.reset}`);

if (issuesFound === 0) {
  console.log(`\n${colors.green}${colors.bright}✓ All checks passed! Your code is ready to be pushed to GitHub.${colors.reset}\n`);
} else {
  console.log(`\n${colors.red}${colors.bright}Found ${issuesFound} issue(s) that should be fixed before pushing to GitHub.${colors.reset}\n`);
}

// Instructions
console.log(`${colors.cyan}Next steps:${colors.reset}`);
console.log(`1. ${issuesFound === 0 ? 'Push your code to GitHub:' : 'Fix the issues above, then push your code:'}`);
console.log(`   ${colors.bright}git push origin main${colors.reset}`);
console.log(`2. Verify deployment settings in your hosting platforms`);
console.log(`3. Run the deployment verification to ensure environment variables are properly configured:`);
console.log(`   ${colors.bright}npm run verify-deployment${colors.reset}\n`);

// Exit with error code if issues were found
process.exit(issuesFound > 0 ? 1 : 0); 