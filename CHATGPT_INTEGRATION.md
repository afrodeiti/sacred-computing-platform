# ChatGPT Integration Guide

This document explains how to integrate the Sacred Computing Platform with ChatGPT using OpenAI's GPT Actions.

## Overview

GPT Actions allow your custom GPT to make API calls to external services. In this case, we're enabling ChatGPT to interact with our Sacred Computing Platform API to provide users with:

1. Sacred geometry pattern generation
2. Intention optimization
3. Healing code recommendations
4. Network packet creation for intention broadcasting

## Setup Instructions

### 1. Deploy the API

Deploy the API to Render using the provided `render.yaml` file:

```bash
# Login to Render CLI if needed
render login

# Deploy using the configuration
render blueprint apply
```

Alternatively, deploy manually through the Render dashboard.

### 2. Configure Your Custom GPT

1. Go to [OpenAI's GPT Builder](https://chat.openai.com/gpts/builder)
2. Create a new GPT
3. Configure the basic details:
   - Name: "Sacred Geometry Healing Assistant"
   - Description: "I help users access sacred geometry patterns, healing codes, and amplify intentions for spiritual and physical wellbeing."
   - Instructions: Use the content from `custom_gpt_instructions.md`
   - Conversation starters: Copy from the instructions file

### 3. Add API Schema

1. In the GPT Builder, go to the "Actions" tab
2. Click "Add action"
3. Choose "Import from URL" or "Import from file"
4. If using URL, provide the URL to your hosted OpenAPI spec (e.g., `https://your-app-name.onrender.com/openapi.yaml`)
5. If using file, upload the `openapi.yaml` file from this repository
6. Set the Authentication method to "None" for public APIs or "API Key" if you've implemented authentication
7. Save your action

### 4. Test Your GPT

Try the conversation starters to ensure your GPT is correctly calling the API. You should be able to:

- Get intention recommendations
- Receive healing code suggestions
- Generate sacred geometry patterns
- Create network packets

## API Usage Examples

### Intention Recommendation

```javascript
// Example request
{
  "userInput": "finding a new job",
  "context": "manifestation"
}

// Example response
{
  "original_input": "finding a new job",
  "recommended_intention": "I am gratefully experiencing finding a new job in my life now",
  "reason": "Manifestation intentions work best with gratitude and present tense phrasing",
  "suggested_field_type": "torus",
  "suggested_frequency": 7.83
}
```

### Healing Code Recommendation

```javascript
// Example request
{
  "situation": "chronic pain",
  "bodyArea": "back",
  "emotionalState": "anxiety"
}

// Example response
{
  "recommended_codes": [
    {
      "id": 12,
      "code": "5891321",
      "description": "Relief from back pain",
      "category": "PHYSICAL",
      "affirmation": "My back is strong and pain-free",
      "vibration": 528,
      "source": "Grabovoi"
    },
    {
      "id": 45,
      "code": "8914321",
      "description": "Anxiety reduction",
      "category": "EMOTIONAL",
      "affirmation": "I am calm and at peace",
      "vibration": 432,
      "source": "Grabovoi"
    },
    {
      "id": 78,
      "code": "7148521",
      "description": "Spinal alignment",
      "category": "PHYSICAL",
      "affirmation": "My spine is perfectly aligned",
      "vibration": 528,
      "source": "Grabovoi"
    }
  ],
  "explanation": "These codes were selected based on your specific needs related to chronic pain",
  "recommended_practice": "Visualize healing energy flowing to your back while reciting these codes 3 times daily."
}
```

## Troubleshooting

If your GPT isn't correctly calling the API:

1. Check that your API is running and accessible
2. Verify that the OpenAPI schema is valid
3. Test the endpoints directly using a tool like Postman
4. Check the OpenAI documentation for GPT Actions for any updates
5. Ensure that any authentication requirements are correctly configured

## Security Considerations

- The API is publicly accessible, so don't include sensitive information
- Consider implementing rate limiting to prevent abuse
- If needed, add authentication to the API and update the OpenAPI spec accordingly

## Further Resources

- [OpenAI GPT Actions Documentation](https://platform.openai.com/docs/actions)
- [OpenAPI Specification](https://swagger.io/specification/)
- [Render Deployment Documentation](https://render.com/docs)