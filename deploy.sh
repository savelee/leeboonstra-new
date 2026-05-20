#!/bin/bash

# Deploy Script - Production Deployment with Firebase
echo "🚀 Starting production deployment..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Clean previous build
echo "🧹 Cleaning previous build..."
hexo clean

# Build and Optimize site (Sass compile, Hexo generate, process images, minify assets)
echo "🎨 Building and optimizing site assets..."
npm run build

# Generate Service Worker
echo "⚙️  Generating Service Worker..."
npx workbox generateSW workbox-config.js

# Deploy to Firebase
#echo "🔥 Deploying to Firebase..."
firebase login --reauth
firebase deploy --only hosting --project leeboonstra-dev-7d578
echo "✅ Deployment completed successfully!"