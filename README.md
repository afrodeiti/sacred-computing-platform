# Sacred Computing Platform

A comprehensive platform for sacred geometry visualization, energetic feedback, and healing code recommendations, with ChatGPT integration capabilities.

## Overview

The Sacred Computing Platform integrates sacred geometry patterns, intention amplification, and healing codes into a powerful API that can be accessed by ChatGPT and other applications. This platform enables users to:

- Generate sacred geometry fields (torus, merkaba, metatron's cube, sri yantra, flower of life)
- Amplify intentions using divine proportion
- Create network packets with embedded intentions
- Access a database of healing codes
- Get personalized healing code recommendations
- Optimize intention wording for maximum effectiveness

## API Endpoints

The platform exposes various endpoints detailed in the OpenAPI specification (`openapi.yaml`):

- `/api/sacred-geometry/{field-type}` - Generate sacred geometry fields
- `/api/healing-codes` - Access healing codes database
- `/api/amplify` - Amplify intentions with divine proportion
- `/api/network-packet` - Create network packets
- `/api/intention-recommendation` - Get optimized intention wording
- `/api/healing-recommendation` - Get personalized healing code recommendations

## Setup for Local Development

### Prerequisites
- Python 3.9+
- Required Python packages (see `python_requirements.txt`)

### Installation

1. Clone this repository:
   ```
   git clone https://github.com/afrodeiti/sacred-computing-platform.git
   cd sacred-computing-platform
   ```

2. Install dependencies:
   ```
   pip install -r python_requirements.txt
   ```

3. Run the API server:
   ```
   python healing-api.py --mode api
   ```

4. The API will be available at `http://localhost:5000`

## Deployment to Render

This repository includes a `render.yaml` file for easy deployment to Render.com:

1. Fork this repository to your GitHub account
2. Sign up for a Render account at https://render.com
3. Connect your GitHub account to Render
4. Click "New" and select "Blueprint" 
5. Select your forked repository
6. Render will automatically deploy the API based on the blueprint configuration

After deployment, your API will be available at `https://sacred-computing-platform.onrender.com`

## Integration with ChatGPT

The Sacred Computing Platform is designed to be called by ChatGPT through OpenAI's Actions/Function Calling feature. 

### Setting Up ChatGPT Integration

1. Use the `openapi.yaml` file as your OpenAPI specification in the ChatGPT Actions interface
2. Set the server URL to your deployed instance (e.g., `https://sacred-computing-platform.onrender.com`)
3. Configure authentication if needed

### Example ChatGPT Prompts

Once integrated, users can interact with the platform through ChatGPT:

- "Create a healing intention for my joint pain"
- "Recommend healing codes for anxiety"
- "Generate a torus field for abundance" 
- "Amplify my intention: 'I am at peace with myself'"

## Running in Different Modes

The platform supports multiple operational modes:

- API mode: `python healing-api.py --mode api`
- Broadcast mode: `python healing-api.py --mode broadcast --intention "Peace and healing" --field-type torus`
- CLI mode: `python healing-api.py --mode cli`

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with respect for sacred geometry principles and energetic healing modalities
- Incorporates Grabovoi codes and other numeric healing sequences
- Designed for seamless integration with AI assistants