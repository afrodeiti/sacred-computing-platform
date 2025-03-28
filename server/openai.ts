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