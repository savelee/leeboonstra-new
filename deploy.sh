#!/bin/bash

# Deploy Script - Production Deployment with Firebase
echo "🚀 Starting production deployment..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Clean previous build
echo "🧹 Cleaning previous build..."
hexo clean

# Compile Sass to CSS and JavaScript
echo "🎨 Compiling Sass to CSS and JavaScript..."
cd themes/leeboonstra/design
npm run sass
npm run build-js
cd ../../../

# Generate Hexo site
echo "🏗️  Generating Hexo site..."
hexo generate

# Generate Service Worker
echo "⚙️  Generating Service Worker..."
workbox generateSW workbox-config.js

# Deploy to Firebase
echo "🔥 Deploying to Firebase..."
firebase login --reauth
firebase deploy --only hosting --project leeboonstra-dev-7d578

echo "✅ Deployment completed successfully!"