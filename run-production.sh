#!/bin/bash
echo "Building Rugira Trading Dashboard..."
npm run build

echo "Starting production server..."
NODE_ENV=production PORT=80 node dist/index.js