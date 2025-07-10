const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m'
};

// Check if directories exist
const clientDir = path.join(__dirname, 'client');
const serverDir = path.join(__dirname, 'server');

if (!fs.existsSync(clientDir)) {
  console.error(`${colors.red}Error: Client directory not found at ${clientDir}${colors.reset}`);
  process.exit(1);
}

if (!fs.existsSync(serverDir)) {
  console.error(`${colors.red}Error: Server directory not found at ${serverDir}${colors.reset}`);
  process.exit(1);
}

// Function to determine the correct command based on OS
const getCommand = (command) => {
  return os.platform() === 'win32' ? `${command}.cmd` : command;
};

console.log(`${colors.cyan}${colors.bright}=== Appointment Scheduler ====${colors.reset}`);
console.log(`${colors.green}Starting both client and server...${colors.reset}\n`);

// Start the server
console.log(`${colors.yellow}Starting server...${colors.reset}`);
const server = spawn(getCommand('npm'), ['start'], { 
  cwd: serverDir,
  stdio: 'pipe',
  shell: true
});

// Start the client
console.log(`${colors.yellow}Starting client...${colors.reset}`);
const client = spawn(getCommand('npm'), ['start'], { 
  cwd: clientDir,
  stdio: 'pipe',
  shell: true
});

// Handle server output
server.stdout.on('data', (data) => {
  console.log(`${colors.green}[SERVER] ${colors.reset}${data.toString().trim()}`);
});

server.stderr.on('data', (data) => {
  console.error(`${colors.red}[SERVER ERROR] ${colors.reset}${data.toString().trim()}`);
});

// Handle client output
client.stdout.on('data', (data) => {
  console.log(`${colors.cyan}[CLIENT] ${colors.reset}${data.toString().trim()}`);
});

client.stderr.on('data', (data) => {
  console.error(`${colors.magenta}[CLIENT ERROR] ${colors.reset}${data.toString().trim()}`);
});

// Handle process exit
const cleanup = () => {
  if (client && !client.killed) {
    client.kill();
  }
  if (server && !server.killed) {
    server.kill();
  }
  console.log(`\n${colors.yellow}Shutting down all processes...${colors.reset}`);
  process.exit(0);
};

// Handle graceful shutdown
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

console.log(`\n${colors.green}${colors.bright}Both client and server are starting up!${colors.reset}`);
console.log(`${colors.yellow}Press Ctrl+C to stop both processes${colors.reset}\n`); 