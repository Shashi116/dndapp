#!/bin/bash

# 🐉 D&D VTT Quick Start Script

echo "================================================"
echo "🐉 D&D Virtual Table Top - Setup & Launch"
echo "================================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Ask user for mode
echo "Choose how to run the application:"
echo "1) Development mode (with hot reload)"
echo "2) Production build"
echo ""
read -p "Enter your choice (1 or 2): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Starting development server..."
        echo "📍 Application will be available at http://localhost:3000"
        echo ""
        echo "DM Controls:"
        echo "  • Press 1 for Brush tool"
        echo "  • Press 2 for Rectangle tool"
        echo "  • Press 0 to disable"
        echo "  • Press R to reset fog"
        echo ""
        npm run dev
        ;;
    2)
        echo ""
        echo "🔨 Building for production..."
        npm run build
        
        if [ $? -eq 0 ]; then
            echo ""
            echo "✅ Build successful!"
            echo ""
            echo "To start the production server, run:"
            echo "  npm start"
            echo ""
            echo "📍 Application will be available at http://localhost:3000"
        else
            echo "❌ Build failed"
            exit 1
        fi
        ;;
    *)
        echo "❌ Invalid choice. Please enter 1 or 2."
        exit 1
        ;;
esac
