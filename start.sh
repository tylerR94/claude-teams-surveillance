#!/bin/bash

# Quick start script for Claude Agent Surveillance Dashboard

echo "🚀 Starting Claude Agent Surveillance Dashboard..."
echo ""

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  bun install --no-optional || npm install
  echo ""
fi

# Start the server
echo "🔍 Starting surveillance server..."
echo "   Dashboard: http://localhost:3847"
echo "   Press Ctrl+C to stop"
echo ""

bun run dev || npm run dev
