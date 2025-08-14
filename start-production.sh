#!/bin/bash
# Production startup script for Rugira Trading Dashboard

echo "Building Rugira Trading Dashboard..."
npm run build

echo "Starting production server..."
NODE_ENV=production node dist/index.js