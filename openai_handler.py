"""
OpenAI Integration for Sacred Computing Platform
"""
import os
import json
import logging
from typing import Dict, Any, List, Optional

# Setup logging
logging.basicConfig(level=logging.INFO, 
                   format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("openai_handler")

# Check if OpenAI is available, but make it optional
try:
    import openai
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False
    logger.warning("OpenAI package not installed. AI-enhanced functions will be limited.")

class OpenAIHandler:
    """Handler for OpenAI API interactions"""
    
    def __init__(self, api_key: Optional[str] = None):
        """Initialize the OpenAI handler"""
        self.api_key = api_key or os.environ.get("OPENAI_API_KEY")
        
        if not self.api_key:
            logger.warning("No OpenAI API key found. AI enhancement features disabled.")
            self.enabled = False
        elif not OPENAI_AVAILABLE:
            logger.warning("OpenAI package not installed. AI enhancement features disabled.")
            self.enabled = False
        else:
            self.client = openai.OpenAI(api_key=self.api_key)
            self.enabled = True
            logger.info("OpenAI handler initialized successfully")
    
    def enhance_intention(self, original_intention: str, context: str = "general") -> Dict[str, Any]:
        """Enhance an intention with AI recommendations"""
        if not self.enabled:
            # Provide a basic response when OpenAI is not available
            return self._fallback_intention_enhancement(original_intention, context)
        
        try:
            prompt = self._build_intention_prompt(original_intention, context)
            
            response = self.client.chat.completions.create(
                model="gpt-4-turbo",
                messages=[
                    {"role": "system", "content": "You are a sacred geometry and intention expert. Enhance the user's intention for optimal resonance and manifestation power."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=300
            )
            
            # Extract the enhanced intention from the response
            enhancement_text = response.choices[0].message.content
            
            # Parse the structured response
            return self._parse_enhancement_response(enhancement_text, original_intention, context)
            
        except Exception as e:
            logger.error(f"Error enhancing intention with OpenAI: {str(e)}")
            return self._fallback_intention_enhancement(original_intention, context)
    
    def recommend_healing_codes(self, situation: str, body_area: Optional[str] = None, 
                              emotional_state: Optional[str] = None) -> Dict[str, Any]:
        """Get AI-enhanced healing code recommendations"""
        if not self.enabled:
            # Provide a message about the limitation
            return {
                "message": "AI-enhanced recommendations unavailable. Please check the healing codes database directly.",
                "healing_codes_available": True
            }
        
        try:
            prompt = self._build_healing_prompt(situation, body_area, emotional_state)
            
            response = self.client.chat.completions.create(
                model="gpt-4-turbo",
                messages=[
                    {"role": "system", "content": "You are an expert in healing codes and frequencies. Recommend the most effective codes for the user's situation."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=500
            )
            
            # Extract the recommendations
            recommendation_text = response.choices[0].message.content
            
            # Return a structured format with the AI recommendations
            return {
                "ai_recommendation": recommendation_text,
                "note": "These are AI-enhanced suggestions. Always refer to the official healing codes database for validated codes."
            }
            
        except Exception as e:
            logger.error(f"Error getting healing recommendations from OpenAI: {str(e)}")
            return {
                "message": f"Error processing AI recommendation: {str(e)}",
                "healing_codes_available": True
            }
    
    def _build_intention_prompt(self, original_intention: str, context: str) -> str:
        """Build the prompt for intention enhancement"""
        # Context-specific prompts
        context_prompts = {
            "healing": "This intention is for physical or emotional healing.",
            "manifestation": "This intention is for manifesting abundance or opportunities.",
            "protection": "This intention is for spiritual or energetic protection.",
            "transformation": "This intention is for personal transformation and growth.",
            "connection": "This intention is for spiritual connection or higher consciousness."
        }
        
        context_info = context_prompts.get(context, "This is a general intention.")
        
        return f"""
        Please enhance the following intention to maximize its resonance and manifestation potential:
        
        Original intention: "{original_intention}"
        
        Context: {context_info}
        
        Respond with an enhanced version that follows these sacred intention principles:
        - Present tense phrasing
        - Positive language (avoid negations)
        - Emotional resonance
        - Clarity and specificity
        - Divine alignment
        
        Provide your response in this format:
        ENHANCED INTENTION: [your enhanced version]
        RATIONALE: [explain why this wording is more effective]
        RECOMMENDED FIELD: [suggest one of: torus, merkaba, metatron, sri_yantra, flower_of_life]
        FREQUENCY: [suggest an optimal frequency in Hz]
        """
    
    def _build_healing_prompt(self, situation: str, body_area: Optional[str], emotional_state: Optional[str]) -> str:
        """Build the prompt for healing code recommendations"""
        body_info = f"Body area: {body_area}" if body_area else "No specific body area mentioned."
        emotional_info = f"Emotional state: {emotional_state}" if emotional_state else "No specific emotional state mentioned."
        
        return f"""
        Please recommend appropriate healing codes for the following situation:
        
        Situation: {situation}
        {body_info}
        {emotional_info}
        
        Based on your expertise with Grabovoi codes and healing frequencies, what would you recommend?
        
        Include:
        1. At least 3 relevant healing codes with descriptions
        2. A suggested practice for applying these codes
        3. Any affirmations that would complement the codes
        """
    
    def _parse_enhancement_response(self, response_text: str, original_intention: str, context: str) -> Dict[str, Any]:
        """Parse the structured response from OpenAI"""
        try:
            # Extract the enhanced intention
            enhanced_intention = ""
            rationale = ""
            field_type = "torus"  # Default
            frequency = 7.83  # Default to Schumann resonance
            
            # Simple parsing of the response
            for line in response_text.split('\n'):
                line = line.strip()
                if line.startswith("ENHANCED INTENTION:"):
                    enhanced_intention = line.replace("ENHANCED INTENTION:", "").strip()
                elif line.startswith("RATIONALE:"):
                    rationale = line.replace("RATIONALE:", "").strip()
                elif line.startswith("RECOMMENDED FIELD:"):
                    field_text = line.replace("RECOMMENDED FIELD:", "").strip().lower()
                    if field_text in ["torus", "merkaba", "metatron", "sri_yantra", "flower_of_life"]:
                        field_type = field_text
                elif line.startswith("FREQUENCY:"):
                    freq_text = line.replace("FREQUENCY:", "").strip()
                    try:
                        # Extract just the number from the frequency text
                        import re
                        number_match = re.search(r'(\d+\.?\d*)', freq_text)
                        if number_match:
                            frequency = float(number_match.group(1))
                    except:
                        pass
            
            # If we couldn't extract the enhanced intention, use the original with a prefix
            if not enhanced_intention:
                enhanced_intention = f"I am in perfect harmony with {original_intention}"
            
            return {
                "original_input": original_intention,
                "recommended_intention": enhanced_intention,
                "reason": rationale or f"This intention has been optimized for the context of {context}.",
                "suggested_field_type": field_type,
                "suggested_frequency": frequency
            }
            
        except Exception as e:
            logger.error(f"Error parsing OpenAI response: {str(e)}")
            return self._fallback_intention_enhancement(original_intention, context)
    
    def _fallback_intention_enhancement(self, original_intention: str, context: str) -> Dict[str, Any]:
        """Provide a fallback response when OpenAI is unavailable"""
        # Context-specific fallback responses
        if context == "healing":
            enhanced = f"I am completely healed and vibrant with {original_intention}"
            field_type = "flower_of_life"
            frequency = 528.0
            reason = "Healing intentions work best with present tense affirmations and the repair frequency of 528Hz"
        elif context == "manifestation":
            enhanced = f"I am gratefully experiencing {original_intention} in my life now"
            field_type = "torus"
            frequency = 7.83
            reason = "Manifestation intentions work best with gratitude and present tense phrasing"
        elif context == "protection":
            enhanced = f"I am divinely protected from all forms of {original_intention}"
            field_type = "merkaba"
            frequency = 13.0
            reason = "Protection intentions work best with the Merkaba field, which creates a natural energetic boundary"
        elif context == "transformation":
            enhanced = f"I am easily transforming {original_intention} with divine grace"
            field_type = "metatron"
            frequency = 9.0
            reason = "Transformation intentions benefit from Metatron's Cube which connects all platonic solids"
        elif context == "connection":
            enhanced = f"I am deeply connected to {original_intention} at all levels of my being"
            field_type = "sri_yantra"
            frequency = 7.83
            reason = "Connection intentions work best with Sri Yantra which represents the cosmos and unity consciousness"
        else:
            enhanced = f"I am in perfect harmony with {original_intention}"
            field_type = "torus"
            frequency = 7.83
            reason = "This balanced intention works for general purposes and aligns with Earth's natural frequency"
        
        return {
            "original_input": original_intention,
            "recommended_intention": enhanced,
            "reason": reason,
            "suggested_field_type": field_type,
            "suggested_frequency": frequency,
            "note": "Basic enhancement provided (OpenAI integration unavailable)"
        }


# Example usage
if __name__ == "__main__":
    # Initialize the handler (will use OPENAI_API_KEY from environment)
    handler = OpenAIHandler()
    
    # Test intention enhancement
    result = handler.enhance_intention("finding inner peace", "healing")
    print(json.dumps(result, indent=2))
    
    # Test healing code recommendation
    healing_result = handler.recommend_healing_codes("chronic back pain", "back", "anxiety")
    print(json.dumps(healing_result, indent=2))