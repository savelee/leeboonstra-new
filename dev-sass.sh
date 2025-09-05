#!/bin/bash

# Sass Development Script - Watch and compile Sass changes
echo "🎨 Starting Sass development mode..."

# Install dependencies if needed
if [ ! -d "themes/leeboonstra/design/node_modules" ]; then
    echo "📦 Installing Sass dependencies..."
    cd themes/leeboonstra/design
    npm install
    cd ../../../
fi

# Start Sass watch mode
echo "👀 Watching for Sass changes..."
echo "🔄 Press Ctrl+C to stop watching"
cd themes/leeboonstra/design
npm run watch
