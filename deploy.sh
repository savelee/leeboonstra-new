#!/bin/bash

# Deploy Script - Production Deployment with Firebase
echo "🚀 Starting production deployment..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Clean previous build
echo "🧹 Cleaning previous build..."
hexo clean

# Build all assets (Sass, JavaScript, copy files)
echo "🎨 Building all assets..."
npm run build:assets

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