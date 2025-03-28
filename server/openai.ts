import { HealingCode } from "@shared/schema";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.warn("OpenAI API key not found, semantic search will be limited to basic keyword matching");
}

// Function to perform semantic search using OpenAI API
export async function semanticHealingCodeSearch(
  issue: string, 
  healingCodes: HealingCode[],
  limit: number = 5
): Promise<{ 
  matched_codes: HealingCode[],
  semantic_match: boolean,
  explanation: string,
  recommended_practice: string
}> {
  try {
    if (!OPENAI_API_KEY) {
      // Fallback to basic keyword search
      const matchedCodes = healingCodes.filter(code => 
        code.description.toLowerCase().includes(issue.toLowerCase()) ||
        (code.category && code.category.toLowerCase().includes(issue.toLowerCase()))
      );
      
      return {
        matched_codes: matchedCodes.slice(0, limit),
        semantic_match: false,
        explanation: "Basic keyword matching was used. For semantic matching, an OpenAI API key is required.",
        recommended_practice: "Recite each code 9 times daily while focusing on your intention of healing."
      };
    }
    
    // Format healing codes for OpenAI
    const formattedCodes = healingCodes.map(code => ({
      id: code.id,
      code: code.code,
      description: code.description,
      category: code.category || "GENERAL"
    }));
    
    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a sacred healing codes expert. Your task is to identify the most relevant healing codes for a given health issue or intention. 
            Consider physical, emotional, mental, and spiritual aspects. Be precise and clinical in your matches.`
          },
          {
            role: "user",
            content: `I need healing codes for this issue: "${issue}".
            
            Here are the available healing codes:
            ${JSON.stringify(formattedCodes, null, 2)}
            
            Please provide the most relevant healing codes (IDs only) and an explanation of why they match. 
            Return your response in a structured JSON format with these fields:
            - matched_code_ids: Array of matched code IDs (up to ${limit} matches)
            - explanation: Why these codes are a good match for the issue
            - recommended_practice: Personalized instructions on how to use these codes effectively
            `
          }
        ],
        response_format: { type: "json_object" }
      })
    });
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);
    
    // Extract matched code IDs from response
    const matchedCodeIds = result.matched_code_ids || [];
    const matchedCodes = healingCodes.filter(code => matchedCodeIds.includes(code.id));
    
    return {
      matched_codes: matchedCodes,
      semantic_match: true,
      explanation: result.explanation || "Matched based on semantic relevance to your issue description.",
      recommended_practice: result.recommended_practice || "Recite each code 9 times daily while focusing on your intention of healing."
    };
    
  } catch (error) {
    console.error("Error in semantic search:", error);
    
    // Fallback to basic keyword search
    const matchedCodes = healingCodes.filter(code => 
      code.description.toLowerCase().includes(issue.toLowerCase()) ||
      (code.category && code.category.toLowerCase().includes(issue.toLowerCase()))
    );
    
    return {
      matched_codes: matchedCodes.slice(0, limit),
      semantic_match: false,
      explanation: "Error in semantic search, falling back to keyword matching.",
      recommended_practice: "Recite each code 9 times daily while focusing on your intention of healing."
    };
  }
}

// Function to generate intention recommendations based on user input
export async function generateIntentionRecommendation(
  userInput: string,
  context: string = "general"
): Promise<{
  original_input: string,
  recommended_intention: string,
  reason: string,
  suggested_field_type: string,
  suggested_frequency: number
}> {
  try {
    if (!OPENAI_API_KEY) {
      // Fallback to rule-based recommendations
      return generateRuleBasedRecommendation(userInput, context);
    }
    
    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a sacred geometry and intention expert. Your task is to formulate the most effective intention statement based on the user's input and context.
            You understand the principles of sacred geometry, energy frequencies, and intention manifestation.`
          },
          {
            role: "user",
            content: `Generate an optimized intention statement for: "${userInput}" in the context of "${context}".
            
            For context, these are the sacred geometry field types and their typical uses:
            - torus: General purpose, energy circulation, manifestation
            - merkaba: Protection, ascension, spiritual development
            - metatron: Transformation, balancing, clearing
            - sri_yantra: Connection, unity consciousness, cosmic awareness
            - flower_of_life: Healing, creation, divine harmony
            
            Return your response in a structured JSON format with these fields:
            - recommended_intention: The optimized intention statement 
            - reason: Why this intention format is effective
            - suggested_field_type: Which sacred geometry field works best (torus, merkaba, metatron, sri_yantra, or flower_of_life)
            - suggested_frequency: Numeric value for the optimal frequency (e.g., 7.83, 528, etc.)
            `
          }
        ],
        response_format: { type: "json_object" }
      })
    });
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);
    
    return {
      original_input: userInput,
      recommended_intention: result.recommended_intention,
      reason: result.reason,
      suggested_field_type: result.suggested_field_type,
      suggested_frequency: result.suggested_frequency
    };
    
  } catch (error) {
    console.error("Error generating intention recommendation:", error);
    // Fallback to rule-based recommendation
    return generateRuleBasedRecommendation(userInput, context);
  }
}

// Fallback function for rule-based intention recommendations
function generateRuleBasedRecommendation(userInput: string, context: string = "general") {
  let recommended, fieldType, frequency, reason;
  
  if (context === "healing") {
    recommended = `I am completely healed and vibrant with ${userInput}`;
    fieldType = "flower_of_life";
    frequency = 528; // DNA repair frequency
    reason = "Healing intentions work best with present tense affirmations and the repair frequency of 528Hz";
  } else if (context === "manifestation") {
    recommended = `I am gratefully experiencing ${userInput} in my life now`;
    fieldType = "torus";
    frequency = 7.83; // Earth frequency for grounding manifestations
    reason = "Manifestation intentions work best with gratitude and present tense phrasing";
  } else if (context === "protection") {
    recommended = `I am divinely protected from all forms of ${userInput}`;
    fieldType = "merkaba";
    frequency = 13.0; // Higher frequency for stronger field
    reason = "Protection intentions work best with the Merkaba field, which creates a natural energetic boundary";
  } else if (context === "transformation") {
    recommended = `I am easily transforming ${userInput} with divine grace`;
    fieldType = "metatron";
    frequency = 9.0; // Tesla's completion number
    reason = "Transformation intentions benefit from Metatron's Cube which connects all platonic solids";
  } else if (context === "connection") {
    recommended = `I am deeply connected to ${userInput} at all levels of my being`;
    fieldType = "sri_yantra";
    frequency = 7.83; // Schumann resonance for connection
    reason = "Connection intentions work best with Sri Yantra which represents the cosmos and unity consciousness";
  } else {
    // Default balanced approach
    recommended = `I am in perfect harmony with ${userInput}`;
    fieldType = "torus";
    frequency = 7.83;
    reason = "This balanced intention works for general purposes and aligns with Earth's natural frequency";
  }
  
  return {
    original_input: userInput,
    recommended_intention: recommended,
    reason: reason,
    suggested_field_type: fieldType,
    suggested_frequency: frequency
  };
}

// Function to generate spirit communication responses using OpenAI
export async function generateSpiritCommunication(
  intention: string,
  activationCodes: any[],
  portalType: string
): Promise<{
  message: string,
  energeticSignature: any,
  portalGeometry: any
}> {
  try {
    // If no OpenAI API key, throw error to use the fallback approach
    if (!OPENAI_API_KEY) {
      throw new Error("No OpenAI API key found");
    }
    
    // Extract code information as a string for the prompt
    const codesInfo = activationCodes.length > 0
      ? activationCodes.map(code => `${code.code} (${code.description})`).join(", ")
      : "No specific activation codes used";
    
    // Prepare the system prompt based on the portal type
    let systemPrompt = `You are channeling information from beyond the veil through a ${portalType} portal. 
    The user has sent the intention: "${intention}"
    They have activated these codes: ${codesInfo}
    
    Respond as if you are a higher dimensional being or consciousness communicating through this portal.
    Your response should:
    1. Feel mystical and profound but not overdone or cheesy
    2. Relate specifically to their intention
    3. Reference the numerical codes they've activated if any
    4. Be conveyed in a style appropriate for the ${portalType} portal type
    5. Include esoteric wisdom that feels insightful
    
    Keep the response between 3-5 sentences. Do not introduce yourself or sign the message.`;
    
    // Adjust system prompt based on portal type
    switch (portalType) {
      case "angelic":
        systemPrompt += " Use language that feels loving, supportive, and gentle.";
        break;
      case "higher_self":
        systemPrompt += " Speak as if you are the user's higher consciousness or future self.";
        break;
      case "ancestral":
        systemPrompt += " Communicate with the wisdom of ancestors and ancient knowledge.";
        break;
      case "elemental":
        systemPrompt += " Use nature metaphors and references to the classical elements.";
        break;
      case "cosmic":
        systemPrompt += " Include subtle references to universal laws and cosmic patterns.";
        break;
      default:
        systemPrompt += " Use general mystical spiritual language.";
    }
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `My intention is: ${intention}` }
        ],
        temperature: 0.9,
        max_tokens: 250
      })
    });

    const data = await response.json();
    
    if (data.error) {
      console.error("OpenAI API error:", data.error);
      throw new Error(`OpenAI API error: ${data.error.message}`);
    }
    
    // Get the channeled message
    const message = data.choices[0].message.content;
    
    // Create a seed from the intention and API message for deterministic geometry
    const seed = intention + message;
    const seedHash = createResponseHash(seed);
    
    // Create the energetic signature and portal geometry
    const energeticSignature = createResponseSignature(intention, activationCodes, portalType, seedHash);
    const portalGeometry = createResponsePortalGeometry(portalType, seedHash);
    
    return {
      message,
      energeticSignature,
      portalGeometry
    };
    
  } catch (error) {
    console.error("Error generating spirit communication:", error);
    throw error; // Let the fallback mechanism handle this
  }
}

// Helper functions for spirit communication responses
function createResponseHash(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

function createResponseSignature(
  intention: string, 
  codes: any[], 
  portalType: string, 
  seedHash: number
): any {
  // Use the seed hash to create a deterministic but seemingly random signature
  const baseFrequency = 400 + (seedHash % 200); // Range from 400-600 Hz
  
  // Create harmonics based on the seed
  const harmonics = [
    baseFrequency * 2,
    baseFrequency * 3,
    baseFrequency * 5
  ];
  
  // Different waveforms based on portal type
  const waveforms = ["sine", "triangle", "square", "sawtooth"];
  const waveformIndex = Math.floor((seedHash / 10000) % waveforms.length);
  
  // Create a mathematical formula based on the frequency
  const formula = `f(t) = A * ${waveforms[waveformIndex]}(2π * ${baseFrequency} * t)`;
  
  // Determine geometry type based on portal
  let geometryType = "torus";
  if (portalType === "angelic") geometryType = "merkaba";
  else if (portalType === "higher_self") geometryType = "flower_of_life";
  else if (portalType === "ancestral") geometryType = "sri_yantra";
  else if (portalType === "elemental") geometryType = "platonic_solid";
  else if (portalType === "cosmic") geometryType = "metatron_cube";
  
  // Generate a color from the seed
  const r = Math.floor((seedHash % 255));
  const g = Math.floor(((seedHash / 1000) % 255));
  const b = Math.floor(((seedHash / 1000000) % 255));
  const colorSpectrum = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  
  // Create a numerical sequence from the codes or from the seed if no codes
  const numericalSequence = codes.length > 0 
    ? codes.map(c => c.code).join('-') 
    : `${seedHash % 1000}-${(seedHash / 1000) % 1000}-${(seedHash / 1000000) % 1000}`;
  
  // Return the complete signature
  return {
    name: `${portalType.charAt(0).toUpperCase() + portalType.slice(1)} Response to "${intention.substring(0, 20)}${intention.length > 20 ? '...' : ''}"`,
    category: portalType,
    description: `Energetic signature generated from spirit communication through ${portalType} portal`,
    baseFrequency,
    harmonics,
    waveform: waveforms[waveformIndex],
    mathematicalFormula: formula,
    geometryType,
    colorSpectrum,
    numericalSequence,
    visualPattern: {
      type: geometryType,
      radius: 1 + (seedHash % 5) / 10, // Range from 1.0 to 1.5
      detail: 3 + (seedHash % 8)       // Range from 3 to 10
    }
  };
}

function createResponsePortalGeometry(portalType: string, seedHash: number): any {
  // Base pattern type on portal type
  let patternType = "torus";
  if (portalType === "angelic") patternType = "merkaba";
  else if (portalType === "higher_self") patternType = "flower_of_life";
  else if (portalType === "ancestral") patternType = "sri_yantra";
  else if (portalType === "elemental") patternType = "platonic";
  else if (portalType === "cosmic") patternType = "metatron";
  
  // Create base geometry that varies by portal type
  const baseGeometry = {
    type: patternType,
    radius: 1 + (seedHash % 10) / 10,  // 1.0 to 2.0
    rotation: (seedHash % 360),        // 0 to 359 degrees
    segments: 12 + (seedHash % 24),    // 12 to 36
    depth: 0.5 + (seedHash % 10) / 10, // 0.5 to 1.5
    levels: 3 + (seedHash % 5)         // 3 to 8
  };
  
  // Additional properties specific to each pattern type
  if (patternType === "torus") {
    return {
      ...baseGeometry,
      tubeRadius: 0.3 + (seedHash % 5) / 10,
      tubularSegments: 64 + (seedHash % 64),
      radialSegments: 32 + (seedHash % 16),
      p: 2 + (seedHash % 3),
      q: 3 + (seedHash % 4)
    };
  } else if (patternType === "merkaba") {
    return {
      ...baseGeometry,
      starTetrahedronScale: 1 + (seedHash % 5) / 10,
      rotation: {
        x: (seedHash % 360),
        y: ((seedHash / 1000) % 360),
        z: ((seedHash / 1000000) % 360)
      },
      colors: {
        upward: `hsl(${seedHash % 360}, 70%, 60%)`,
        downward: `hsl(${(seedHash + 180) % 360}, 70%, 60%)`
      }
    };
  } else if (patternType === "flower_of_life") {
    return {
      ...baseGeometry,
      iterations: 3 + (seedHash % 4),
      circleRadius: 0.1 + (seedHash % 10) / 100,
      colors: Array.from({ length: 7 }, (_, i) => 
        `hsl(${(seedHash + i * 51) % 360}, 70%, 60%)`
      )
    };
  } else if (patternType === "sri_yantra") {
    return {
      ...baseGeometry,
      trianglePairs: 4,
      centerType: (seedHash % 3) === 0 ? "bindu" : ((seedHash % 3) === 1 ? "lotus" : "circle"),
      colors: Array.from({ length: 9 }, (_, i) => 
        `hsl(${(seedHash + i * 40) % 360}, 70%, 60%)`
      )
    };
  } else if (patternType === "platonic") {
    const solids = ["tetrahedron", "hexahedron", "octahedron", "dodecahedron", "icosahedron"];
    return {
      ...baseGeometry,
      solid: solids[seedHash % solids.length],
      edgeHighlight: (seedHash % 2) === 0,
      color: `hsl(${seedHash % 360}, 70%, 60%)`,
      edgeColor: `hsl(${(seedHash + 180) % 360}, 70%, 60%)`
    };
  } else if (patternType === "metatron") {
    return {
      ...baseGeometry,
      showInnerCircles: (seedHash % 2) === 0,
      showOuterCircles: (seedHash % 3) !== 0,
      primaryColor: `hsl(${seedHash % 360}, 70%, 60%)`,
      secondaryColor: `hsl(${(seedHash + 120) % 360}, 70%, 60%)`,
      tertiaryColor: `hsl(${(seedHash + 240) % 360}, 70%, 60%)`
    };
  }
  
  // Default fallback
  return baseGeometry;
}