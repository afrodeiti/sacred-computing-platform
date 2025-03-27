#!/bin/bash
# Custom build script for Render deployment

# Install dependencies
npm ci

# Run the build process with explicit npx
npx vite build
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

# Make sure the output directory exists
echo "Build completed!"