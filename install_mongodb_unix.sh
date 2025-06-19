#!/bin/bash

# Detect OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    echo "Installing MongoDB on macOS..."
    
    # Check if Homebrew is installed
    if ! command -v brew &> /dev/null; then
        echo "Homebrew not found. Installing Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    fi
    
    # Install MongoDB
    echo "Installing MongoDB using Homebrew..."
    brew tap mongodb/brew
    brew install mongodb-community
    
    # Start MongoDB service
    echo "Starting MongoDB service..."
    brew services start mongodb-community
    
    echo "MongoDB installation complete!"
    
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    echo "Installing MongoDB on Linux..."
    
    # Detect distribution
    if [ -f /etc/debian_version ]; then
        # Debian/Ubuntu
        echo "Detected Debian/Ubuntu..."
        
        echo "Importing MongoDB public GPG key..."
        wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
        
        echo "Adding MongoDB repository..."
        echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
        
        echo "Updating package lists..."
        sudo apt-get update
        
        echo "Installing MongoDB packages..."
        sudo apt-get install -y mongodb-org
        
        echo "Starting MongoDB service..."
        sudo systemctl start mongod
        sudo systemctl enable mongod
        
    elif [ -f /etc/redhat-release ]; then
        # RHEL/CentOS/Fedora
        echo "Detected RHEL/CentOS/Fedora..."
        
        echo "Creating MongoDB repository file..."
        cat <<EOF | sudo tee /etc/yum.repos.d/mongodb-org-6.0.repo
[mongodb-org-6.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/\$releasever/mongodb-org/6.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-6.0.asc
EOF
        
        echo "Installing MongoDB packages..."
        sudo yum install -y mongodb-org
        
        echo "Starting MongoDB service..."
        sudo systemctl start mongod
        sudo systemctl enable mongod
        
    else
        echo "Unsupported Linux distribution. Please install MongoDB manually."
        exit 1
    fi
    
    echo "MongoDB installation complete!"
    
else
    echo "Unsupported operating system. Please install MongoDB manually."
    exit 1
fi

echo "You can now run the application with 'npm run dev'" 