#!/bin/bash

echo "🚀 Setting up Node.js version 16.1.0 for the admin panel..."

# Check if nvm is installed
if ! command -v nvm &> /dev/null; then
    echo "❌ nvm is not installed. Please install nvm first:"
    echo "   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    echo "   Then restart your terminal and run this script again."
    exit 1
fi

# Check if Node.js 16.1.0 is installed
if ! nvm list | grep -q "v16.1.0"; then
    echo "📦 Installing Node.js 16.1.0..."
    nvm install 16.1.0
fi

# Use Node.js 16.1.0
echo "🔄 Switching to Node.js 16.1.0..."
nvm use 16.1.0

# Verify the version
CURRENT_VERSION=$(node --version)
echo "✅ Current Node.js version: $CURRENT_VERSION"

if [ "$CURRENT_VERSION" = "v16.1.0" ]; then
    echo "🎉 Successfully set up Node.js 16.1.0!"
    echo "📝 You can now run: npm install"
else
    echo "❌ Failed to switch to Node.js 16.1.0"
    exit 1
fi 