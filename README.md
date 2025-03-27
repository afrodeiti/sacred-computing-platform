# Sacred Computing Platform

A comprehensive spiritual computing platform that combines sacred geometry, healing codes, and intention broadcasting through WiFi network packets. The platform includes a Python API backend and a JavaScript frontend for visualization.

## Features

- 🔮 **Sacred Geometry Visualization**: Generate and visualize torus fields, merkaba fields, Metatron's Cube, Sri Yantra, and Flower of Life patterns
- ✨ **Real-time Energetic Feedback**: Get immediate feedback on intention broadcasting through WebSockets
- 📡 **Network Packet Intention Broadcasting**: Embed intentions into WiFi packets for distribution
- 🧘‍♀️ **Healing Code Database**: Access a comprehensive database of Grabovoi codes and healing frequencies
- 💾 **Soul Archive Storage**: Persist your spiritual work in a database
- 🤖 **ChatGPT Integration**: Use API integration with OpenAI models to enhance intention setting and get personalized healing recommendations

## Tech Stack

- **Backend**: Python (Flask, SQLite)
- **Frontend**: JavaScript/React
- **API Spec**: OpenAPI 3.1.0
- **Database**: SQLite (local), PostgreSQL (production)
- **Real-time**: WebSockets
- **AI Integration**: OpenAI API for intention enhancement

## Deployment

The API can be deployed to Render and called by ChatGPT models via API Actions.

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js 16+
- OpenAI API key (for ChatGPT integration)

### Installation

1. Clone this repository
```bash
git clone https://github.com/yourusername/sacred-computing-platform.git
cd sacred-computing-platform
```

2. Install Python dependencies
```bash
pip install -r python_requirements.txt
```

3. Install JavaScript dependencies
```bash
cd client
npm install
```

4. Set up environment variables
```bash
export OPENAI_API_KEY="your_openai_api_key"
```

### Running the Application

#### Python API Server
```bash
python healing-api.py
```

#### Web Interface
```bash
cd client
npm run dev
```

## API Reference

The Sacred Computing Platform exposes a comprehensive API for integrating with other applications, including ChatGPT.

For detailed API specifications, check out the [OpenAPI specification](openapi.yaml).

### Key Endpoints

- `/api/sacred-geometry/{type}` - Generate sacred geometry patterns (torus, merkaba, metatron, sri-yantra, flower-of-life)
- `/api/healing-codes` - Access the healing code database
- `/api/network-packet` - Create network packets with embedded intentions
- `/api/intention-recommendation` - Get AI-enhanced intention recommendations
- `/api/healing-recommendation` - Get personalized healing code recommendations

## ChatGPT Integration

This platform can be integrated with ChatGPT through custom GPT Actions. The OpenAPI specification file (`openapi.yaml`) defines all the endpoints that ChatGPT can call.

Example custom GPT instructions:

```
You are a Sacred Geometry and Healing expert. You can help users enhance their intentions, find suitable healing codes, and generate sacred geometry patterns.

You have access to the Sacred Computing Platform API which allows you to:
1. Recommend intention phrasings for specific purposes
2. Generate sacred geometry fields (torus, merkaba, etc.)
3. Find healing codes for specific conditions
4. Create energetic network packets with embedded intentions

When users express a need for healing, manifestation, or spiritual growth, offer to use the API to provide personalized recommendations.
```

## Healing Codes Database

This platform includes an extensive database of healing codes including:

- Grabovoi codes for physical healing
- Emotional healing frequencies
- Financial abundance codes
- Relationship harmony numbers
- Chakra balancing sequences

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Sacred geometry principles from ancient traditions
- Modern energy healing techniques
- Quantum physics principles applied to spiritual computing