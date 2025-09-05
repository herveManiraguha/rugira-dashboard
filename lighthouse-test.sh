#!/bin/bash

# Lighthouse CI Testing Script for Rugira Dashboard
# Ensures reproducible Lighthouse runs without browser extensions

echo "🚀 Building production bundle..."
npm run build

echo "📊 Creating reports directory..."
mkdir -p reports/lh

echo "🔍 Running Lighthouse tests..."

# Test login page
echo "Testing /login page..."
npx lighthouse http://localhost:5000/login \
  --output=html \
  --output-path=./reports/lh/login.html \
  --chrome-flags='--headless --no-sandbox --disable-gpu' \
  --only-categories=performance,best-practices,seo \
  --throttling.cpuSlowdownMultiplier=1

# Test overview page (requires auth - using demo mode)
echo "Testing /overview page..."
npx lighthouse http://localhost:5000/overview \
  --output=html \
  --output-path=./reports/lh/overview.html \
  --chrome-flags='--headless --no-sandbox --disable-gpu' \
  --only-categories=performance,best-practices,seo \
  --throttling.cpuSlowdownMultiplier=1

echo "✅ Lighthouse tests complete! Reports saved in reports/lh/"
echo "📈 Performance thresholds:"
echo "  - Performance: >0.85"
echo "  - Best Practices: >0.90"
echo "  - SEO: >0.90"