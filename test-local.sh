#!/bin/bash

# Local Test Script - Development and Testing
echo "🧪 Starting local development setup..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Clean previous build
echo "🧹 Cleaning previous build..."
hexo clean

# Compile Sass to CSS
echo "🎨 Compiling Sass to CSS..."
cd themes/leeboonstra/design
npm run sass
cd ../../../

# Generate Hexo site
echo "🏗️  Generating Hexo site..."
hexo generate

# Start local server
echo "🌐 Starting local development server..."
echo "📱 Your site will be available at: http://localhost:4000"
echo "🔄 Press Ctrl+C to stop the server"
hexo server
