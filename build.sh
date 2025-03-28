#!/bin/bash
set -e

echo "Starting production build process..."

# Install dependencies
npm ci

# Create a minimal static client without vite
echo "Creating static client..."
mkdir -p dist/public
cp -r client/public/* dist/public/ 2>/dev/null || :

# Create a minimal index.html
cat > dist/public/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sacred Computing Platform</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      margin: 0;
      padding: 0;
      background: #f5f5f5;
      color: #333;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      text-align: center;
    }
    h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      background: linear-gradient(45deg, #8a2be2, #4169e1);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p {
      font-size: 1.2rem;
      line-height: 1.6;
      margin-bottom: 2rem;
    }
    .api-link {
      display: inline-block;
      padding: 0.8rem 1.5rem;
      background: linear-gradient(45deg, #8a2be2, #4169e1);
      color: white;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
      transition: all 0.3s ease;
    }
    .api-link:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Sacred Computing Platform</h1>
    <p>Welcome to the Sacred Computing Platform API. This service provides access to sacred geometry, intention broadcasting, and healing code functionality.</p>
    <a href="/api/healing-codes" class="api-link">View Healing Codes API</a>
  </div>
</body>
</html>
EOF

# Build the production server
echo "Building server..."
npx esbuild server/production.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/production.js

# Create a symlink for compatibility with the start script
echo "Creating symlink for compatibility..."
ln -sf production.js dist/index.js

# Push the database schema
echo "Pushing database schema..."
npx drizzle-kit push

# Build database initialization script
echo "Building database initialization script..."
npx esbuild server/initialize-data.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/initialize-data.js

# Initialize database with healing codes
echo "Initializing database with healing codes..."
node dist/initialize-data.js

# Clean up development dependencies
echo "Cleaning up dependencies..."
rm -rf node_modules

# Install only production dependencies
npm ci --production

echo "Build completed successfully!"