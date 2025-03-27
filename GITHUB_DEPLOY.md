# GitHub and Render Deployment Guide

This document provides step-by-step instructions for deploying the Sacred Computing Platform to GitHub and Render.

## Pushing to GitHub

1. **Create a new repository** on GitHub:
   - Go to https://github.com/new
   - Name it `sacred-computing-platform`
   - Make it public
   - Don't initialize with README, .gitignore, or license (we already have these)

2. **Initialize Git locally** and push your code:
   ```bash
   # Initialize Git repository
   git init

   # Add all files to staging
   git add .

   # Commit your files
   git commit -m "Initial commit of Sacred Computing Platform with ChatGPT integration"

   # Add your GitHub repository as the remote origin
   git remote add origin https://github.com/afrodeiti/sacred-computing-platform.git

   # Push to GitHub
   git push -u origin main
   ```

   If your main branch is called "master" instead of "main", use:
   ```bash
   git push -u origin master
   ```

## Deploying to Render

1. **Create a Render account** (if you don't have one):
   - Go to https://render.com
   - Sign up with your GitHub account for easy integration

2. **Connect your GitHub repository**:
   - In the Render dashboard, click "New" and select "Blueprint"
   - Find and select your `sacred-computing-platform` repository
   - Render will automatically detect the `render.yaml` configuration

3. **Configure environment variables** (if needed):
   - Click on your web service after it's created
   - Go to the "Environment" tab
   - Add any needed secrets or API keys
   - Add the OPENAI_API_KEY if you're using OpenAI APIs directly

4. **Deploy**:
   - Render will automatically deploy your application
   - Wait for the build and deployment to complete
   - Your API will be available at `https://sacred-computing-platform.onrender.com`

## Testing Your Deployment

1. **Test basic API endpoints**:
   ```bash
   # Test the healing codes endpoint
   curl https://sacred-computing-platform.onrender.com/api/healing-codes

   # Test the torus field generation endpoint
   curl -X POST https://sacred-computing-platform.onrender.com/api/sacred-geometry/torus \
     -H "Content-Type: application/json" \
     -d '{"intention": "perfect health and vitality", "frequency": 7.83}'
   ```

2. **Set up ChatGPT integration**:
   - Go to https://chat.openai.com
   - Create a new GPT
   - In the "Actions" section, upload your `openapi.yaml` file
   - Set the server URL to your Render deployment URL
   - Test with example queries from the README.md

## Troubleshooting

- **Deployment issues**: Check the Render logs for any build or runtime errors
- **API errors**: Test individual endpoints with curl to isolate the problem
- **ChatGPT integration issues**: Verify your OpenAPI specification is valid using a validator