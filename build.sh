#!/bin/bash
set -e

# Install production dependencies
npm ci

# Build the client
npx vite build

# Build the production server
npx esbuild server/production.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/production.js

# Push the database schema
echo "Pushing database schema..."
npx drizzle-kit push

# Clean up
rm -rf node_modules

# Install only production dependencies
npm ci --production

echo "Build completed successfully!"