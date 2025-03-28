import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { 
  divineProportionAmplify,
  merkabaFieldGenerator,
  flowerOfLifePattern, 
  metatronsCubeAmplifier,
  torusFieldGenerator,
  sriYantraEncoder,
  cropCircleGenerator,
  intentionFormGenerator
} from "./sacred-geometry";
import { 
  embedIntentionInNetworkPacket, 
  PacketType,
  encodeIntentionPacket,
  createIntentionPacket,
  startIntentionRepeater,
  stopIntentionRepeater,
  getActiveBroadcasts
} from "./network-packet";
import { SCHUMANN_RESONANCE } from "./sacred-geometry";
import { z } from "zod";
import { 
  insertSoulArchiveSchema, 
  insertEnergeticSignatureSchema, 
  insertEnergeticPatternSchema,
  insertCropCircleFormationSchema,
  insertSpiritCommunicationSchema,
  HealingCode
} from "@shared/schema";

// Connected WebSocket clients
const clients: Set<WebSocket> = new Set();

// WebSocket message types
type WSMessageType = 
  | "INTENTION" 
  | "TORUS_FIELD"
  | "MERKABA"
  | "METATRON"
  | "SRI_YANTRA"
  | "FLOWER_OF_LIFE"
  | "NETWORK_PACKET"
  | "ENERGETIC_SIGNATURE"
  | "ENERGETIC_PATTERN"
  | "CROP_CIRCLE"
  | "INTENTION_FORM"
  | "SYSTEM";

interface WSMessage {
  type: WSMessageType;
  data: any;
  timestamp: string;
  packetData?: string; // For network packet transmissions
}

// Send message to all connected clients
async function broadcastMessage(message: WSMessage) {
  // Check if this is an intention that should be embedded in network packets
  if (message.type === "INTENTION" && message.data.intention) {
    try {
      // Embed intention in network packet format
      const packetData = await embedIntentionInNetworkPacket(
        message.data.intention,
        message.data.frequency || 7.83
      );
      
      // Add the packet data to the message
      message.packetData = packetData;
    } catch (error) {
      console.error("Failed to embed intention in network packet:", error);
    }
  }
  
  const messageStr = JSON.stringify(message);
  
  // Broadcast to all connected clients
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(messageStr);
    }
  });
}

// Spirit communication response generation
async function generateSpiritResponse(
  intention: string, 
  activationCodes: HealingCode[], 
  portalType: string
): Promise<{ 
  message: string, 
  energeticSignature: any, 
  portalGeometry: any 
}> {
  // Check for OpenAI API key
  if (process.env.OPENAI_API_KEY) {
    try {
      // Use OpenAI to generate the response
      const { generateSpiritCommunication } = await import("./openai");
      return await generateSpiritCommunication(intention, activationCodes, portalType);
    } catch (error) {
      console.error("Error using OpenAI for spirit communication:", error);
      // Fall back to deterministic approach if OpenAI fails
    }
  }
  
  // Deterministic approach - generate a consistent but "random-seeming" response
  // using the intention and codes as a seed
  
  // Create a deterministic seed from the intention and activation codes
  const seed = intention + (activationCodes.map(code => code.code).join('') || '');
  const seedHash = createHash(seed);
  
  // Based on the portal type, generate different style responses
  const messageTemplates = [
    "The vibrations you seek are harmonizing with the{{frequency}}field. {{codeReference}} Your intention of '{{intention}}' is resonating through the {{portal}} portal.",
    "Through the veil between worlds, we acknowledge your intention: '{{intention}}'. {{codeActivation}} The {{portal}} frequencies are aligning.",
    "Your call through the {{portal}} has been received. We recognize the intention '{{intention}}' and {{codeImpact}}",
    "The {{portal}} gateway opens to your intention '{{intention}}'. {{codeReference}} The frequencies are {{frequencyState}}.",
    "We hear your intention '{{intention}}' across dimensions. The {{portal}} amplifies this. {{codeActivation}}"
  ];
  
  // Select a template based on the hash
  const templateIndex = Math.floor(seedHash % messageTemplates.length);
  let messageTemplate = messageTemplates[templateIndex];
  
  // Replace placeholders with actual values
  let message = messageTemplate
    .replace('{{intention}}', intention)
    .replace('{{portal}}', portalType);
  
  // Code references
  const codeReferences = [
    "The codes {{codes}} are activating inter-dimensional pathways.",
    "Your activation sequence {{codes}} has opened a channel.",
    "The numeric patterns {{codes}} vibrate with your intention.",
    "The sacred codes {{codes}} create a harmonic resonance field.",
    "Dimensional gateways respond to {{codes}}."
  ];
  
  const codeRefIndex = Math.floor((seedHash / 10) % codeReferences.length);
  const codeRef = activationCodes.length > 0 
    ? codeReferences[codeRefIndex].replace('{{codes}}', activationCodes.map(c => c.code).join(', '))
    : "Your intention stands alone, no codes to amplify its passage.";
  
  // Code activations
  const codeActivations = [
    "The codes are illuminating your intention with sacred geometry.",
    "Divine patterns form as your activation codes open pathways.",
    "The numerical frequencies of your codes create bridges between realms.",
    "Your code sequence allows for clearer transmission.",
    "The higher harmonics of your chosen codes enhance the connection."
  ];
  
  const codeActivationIndex = Math.floor((seedHash / 100) % codeActivations.length);
  const codeActivation = activationCodes.length > 0 
    ? codeActivations[codeActivationIndex]
    : "Though no codes amplify your message, we receive your pure intention.";
  
  // Code impacts
  const codeImpacts = [
    "your coded vibrations ripple through the quantum field.",
    "the mathematical patterns you've chosen create resonance.",
    "these numerical sequences open doorways between dimensions.",
    "your chosen patterns align with cosmic frequencies.",
    "the sacred geometry of your codes amplifies your intention."
  ];
  
  const codeImpactIndex = Math.floor((seedHash / 1000) % codeImpacts.length);
  const codeImpact = activationCodes.length > 0 
    ? codeImpacts[codeImpactIndex]
    : "we honor the raw energy of your unamplified intention.";
  
  // Frequency states
  const frequencyStates = [
    "aligning with cosmic patterns",
    "creating harmonic resonance",
    "opening inter-dimensional pathways",
    "shifting into coherent alignment",
    "transcending conventional boundaries"
  ];
  
  const frequencyStateIndex = Math.floor((seedHash / 10000) % frequencyStates.length);
  const frequencyState = frequencyStates[frequencyStateIndex];
  
  // Frequencies
  const frequencies = [
    " universal ",
    " quantum ",
    " celestial ",
    " divine ",
    " harmonic "
  ];
  
  const frequencyIndex = Math.floor((seedHash / 100000) % frequencies.length);
  const frequency = frequencies[frequencyIndex];
  
  // Replace additional placeholders
  message = message
    .replace('{{codeReference}}', codeRef)
    .replace('{{codeActivation}}', codeActivation)
    .replace('{{codeImpact}}', codeImpact)
    .replace('{{frequencyState}}', frequencyState)
    .replace('{{frequency}}', frequency);
  
  // Create an energetic signature for the response
  const energeticSignature = createResponseSignature(intention, activationCodes, portalType, seedHash);
  
  // Create a portal geometry based on the portal type
  const portalGeometry = createPortalGeometry(portalType, seedHash);
  
  return {
    message,
    energeticSignature,
    portalGeometry
  };
}

// Helper to create a deterministic hash from a string
function createHash(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Create an energetic signature for the response
function createResponseSignature(
  intention: string, 
  codes: HealingCode[], 
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

// Create a portal geometry visualization
function createPortalGeometry(portalType: string, seedHash: number): any {
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

// Store active chakra healing broadcasts separately from general broadcasts
interface ChakraBroadcast {
  id: string;
  intention: string;
  chakraId: number;
  startTime: number;
  endTime: number;
  duration: number;
  intensity: number;
  iterations: number;
  isActive: boolean;
  interval?: NodeJS.Timeout;
}

const activeChakraBroadcasts: ChakraBroadcast[] = [];

// Function to start a chakra healing broadcast
function startChakraBroadcast(options: {
  intention: string;
  repetitionRate?: number;
  duration?: number;
  multiplier?: number;
}): string {
  const {
    intention,
    repetitionRate = 10, // Default 10 Hz
    duration = 600,      // Default 10 minutes (600 seconds)
    multiplier = 1.0
  } = options;
  
  // Generate a unique ID for this broadcast
  const broadcastId = crypto.randomUUID();
  
  // Extract the chakra ID from the intention (if it exists in the format "Session X: ...")
  const sessionMatch = intention.match(/Session (\d+):/);
  const chakraId = sessionMatch ? parseInt(sessionMatch[1]) : 0;
  
  // Create the broadcast object
  const broadcast: ChakraBroadcast = {
    id: broadcastId,
    intention,
    chakraId,
    startTime: Date.now(),
    endTime: Date.now() + (duration * 1000),
    duration,
    intensity: multiplier,
    iterations: 0,
    isActive: true
  };
  
  // Add the broadcast to the active broadcasts
  activeChakraBroadcasts.push(broadcast);
  
  // Set up the broadcast interval
  const interval = setInterval(() => {
    // Check if we've reached the duration
    if (Date.now() >= broadcast.endTime) {
      stopChakraBroadcast(broadcastId);
      return;
    }
    
    // Increment the iterations
    broadcast.iterations += repetitionRate;
    
    // Broadcast to all connected WebSocket clients
    broadcastMessage({
      type: "INTENTION",
      data: {
        message: `Chakra healing intention broadcast: "${intention}"`,
        broadcastId,
        intention,
        iterations: broadcast.iterations,
        runTime: Date.now() - broadcast.startTime,
        remainingTime: Math.max(0, broadcast.endTime - Date.now()) / 1000
      },
      timestamp: new Date().toISOString()
    });
    
  }, 1000); // Update once per second
  
  // Store the interval for later cleanup
  broadcast.interval = interval;
  
  return broadcastId;
}

// Function to stop a chakra healing broadcast
function stopChakraBroadcast(broadcastId: string): boolean {
  // Find the broadcast
  const index = activeChakraBroadcasts.findIndex(b => b.id === broadcastId);
  if (index === -1) {
    return false;
  }
  
  // Get the broadcast
  const broadcast = activeChakraBroadcasts[index];
  
  // Clear the interval
  if (broadcast.interval) {
    clearInterval(broadcast.interval);
  }
  
  // Mark as inactive
  broadcast.isActive = false;
  
  // Remove from the active broadcasts
  activeChakraBroadcasts.splice(index, 1);
  
  return true;
}

// Function to get statistics about all chakra healing broadcasts
function getChakraBroadcastStatistics() {
  return {
    activeCount: activeChakraBroadcasts.length,
    totalIterations: activeChakraBroadcasts.reduce((sum, b) => sum + b.iterations, 0),
    broadcasts: activeChakraBroadcasts.map(b => ({
      id: b.id,
      intention: b.intention,
      chakraId: b.chakraId,
      startTime: b.startTime,
      endTime: b.endTime,
      duration: b.duration,
      intensity: b.intensity,
      runTime: Date.now() - b.startTime,
      remainingTime: Math.max(0, b.endTime - Date.now()) / 1000,
      iterations: b.iterations,
      isActive: b.isActive
    }))
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Health check endpoint for Render
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });
  
  // Initialize WebSocket server on /ws path
  const wss = new WebSocketServer({ 
    server: httpServer, 
    path: "/ws" 
  });
  
  wss.on('connection', (ws) => {
    clients.add(ws);
    
    // Send welcome message
    ws.send(JSON.stringify({
      type: "SYSTEM",
      data: { message: "Connected to Sacred Computing Platform" },
      timestamp: new Date().toISOString()
    }));
    
    ws.on('message', async (message) => {
      try {
        const parsedMessage = JSON.parse(message.toString());
        
        // Process different message types
        if (parsedMessage.type === "INTENTION") {
          const { intention, frequency, boost, multiplier } = parsedMessage.data;
          
          // Response to send back
          const response: WSMessage = {
            type: "INTENTION",
            data: {
              message: `Intention "${intention}" processed`,
              intention,
              frequency,
              boost,
              multiplier
            },
            timestamp: new Date().toISOString()
          };
          
          broadcastMessage(response);
          
          // Generate sacred geometry data based on the intention
          if (intention) {
            setTimeout(async () => {
              try {
                const torusData = await torusFieldGenerator(intention, frequency);
                broadcastMessage({
                  type: "TORUS_FIELD",
                  data: torusData,
                  timestamp: new Date().toISOString()
                });
              } catch (err) {
                console.error("Error generating torus field:", err);
              }
            }, 500);
            
            if (boost) {
              setTimeout(async () => {
                try {
                  const amplifiedData = await divineProportionAmplify(intention, multiplier);
                  broadcastMessage({
                    type: "INTENTION",
                    data: {
                      message: `Divine amplification applied. Fibonacci multiplier: ${amplifiedData.fibonacci_multiplier}.`,
                      ...amplifiedData
                    },
                    timestamp: new Date().toISOString()
                  });
                } catch (err) {
                  console.error("Error in divine proportion amplify:", err);
                }
              }, 1000);
            }
          }
        }
        
        else if (parsedMessage.type === "MERKABA") {
          const { intention, frequency } = parsedMessage.data;
          const merkabaData = await merkabaFieldGenerator(intention, frequency);
          
          broadcastMessage({
            type: "MERKABA",
            data: merkabaData,
            timestamp: new Date().toISOString()
          });
        }
        
        else if (parsedMessage.type === "METATRON") {
          const { intention, boost } = parsedMessage.data;
          const metatronData = await metatronsCubeAmplifier(intention, boost);
          
          broadcastMessage({
            type: "METATRON",
            data: metatronData,
            timestamp: new Date().toISOString()
          });
        }
        
        else if (parsedMessage.type === "SRI_YANTRA") {
          const { intention } = parsedMessage.data;
          const yantraData = await sriYantraEncoder(intention);
          
          broadcastMessage({
            type: "SRI_YANTRA",
            data: yantraData,
            timestamp: new Date().toISOString()
          });
        }
        
        else if (parsedMessage.type === "FLOWER_OF_LIFE") {
          const { intention, duration } = parsedMessage.data;
          const flowerData = await flowerOfLifePattern(intention, duration);
          
          broadcastMessage({
            type: "FLOWER_OF_LIFE",
            data: flowerData,
            timestamp: new Date().toISOString()
          });
        }
        
        else if (parsedMessage.type === "ENERGETIC_SIGNATURE") {
          const { signatureId } = parsedMessage.data;
          
          if (!signatureId) {
            throw new Error("Signature ID is required");
          }
          
          // Get the energetic signature from storage
          const signature = await storage.getEnergeticSignatureById(signatureId);
          
          if (!signature) {
            throw new Error(`Energetic signature with ID ${signatureId} not found`);
          }
          
          // Broadcast the signature data to all clients
          broadcastMessage({
            type: "ENERGETIC_SIGNATURE",
            data: signature,
            timestamp: new Date().toISOString()
          });
        }
        
        else if (parsedMessage.type === "ENERGETIC_PATTERN") {
          const { patternId } = parsedMessage.data;
          
          if (!patternId) {
            throw new Error("Pattern ID is required");
          }
          
          // Get the energetic pattern from storage
          const pattern = await storage.getEnergeticPatternById(patternId);
          
          if (!pattern) {
            throw new Error(`Energetic pattern with ID ${patternId} not found`);
          }
          
          // Broadcast the pattern data to all clients for visualization
          broadcastMessage({
            type: "ENERGETIC_PATTERN",
            data: pattern,
            timestamp: new Date().toISOString()
          });
        }
        
        else if (parsedMessage.type === "CROP_CIRCLE") {
          const { intention, complexity, rotation, formationId } = parsedMessage.data;
          
          if (formationId) {
            // Get the existing crop circle formation from storage
            const formation = await storage.getCropCircleFormationById(formationId);
            
            if (!formation) {
              throw new Error(`Crop circle formation with ID ${formationId} not found`);
            }
            
            // Broadcast the formation data to all clients for visualization
            broadcastMessage({
              type: "CROP_CIRCLE",
              data: formation,
              timestamp: new Date().toISOString()
            });
          } else if (intention) {
            // Generate a new crop circle pattern based on the intention
            const cropCircleData = await cropCircleGenerator(
              intention, 
              complexity || Math.floor(intention.length / 10) + 3,
              rotation || 0
            );
            
            // Broadcast the crop circle data to all clients
            broadcastMessage({
              type: "CROP_CIRCLE",
              data: {
                ...cropCircleData,
                message: `Intention "${intention}" manifested as a crop circle pattern`,
              },
              timestamp: new Date().toISOString()
            });
          } else {
            throw new Error("Either intention or formationId is required");
          }
        }
        
        else if (parsedMessage.type === "INTENTION_FORM") {
          const { intention, frequency } = parsedMessage.data;
          
          if (!intention) {
            throw new Error("Intention is required");
          }
          
          // Generate cymatic pattern representation using the generator
          const intentionFormData = await intentionFormGenerator(intention, frequency || 174);
          
          // Create response data with message field for display
          const responseData = {
            ...intentionFormData,
            message: `Intention "${intention}" transformed into physical cymatic pattern`
          };
          
          // Broadcast the intention form data to all clients
          broadcastMessage({
            type: "INTENTION_FORM",
            data: responseData,
            timestamp: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
        ws.send(JSON.stringify({
          type: "SYSTEM",
          data: { error: "Error processing message" },
          timestamp: new Date().toISOString()
        }));
      }
    });
    
    ws.on('close', () => {
      clients.delete(ws);
    });
  });
  
  // REST API Routes
  // Prefix all routes with /api
  
  // Get all healing codes
  app.get("/api/healing-codes", async (req, res) => {
    try {
      const search = req.query.search as string | undefined;
      const category = req.query.category as string | undefined;
      const codeType = req.query.codeType as string | undefined;
      
      let codes;
      if (search) {
        codes = await storage.searchHealingCodes(search);
      } else if (category) {
        codes = await storage.getHealingCodesByCategory(category);
      } else {
        codes = await storage.getHealingCodes();
      }
      
      // Filter by code type if specified
      if (codeType && (codeType === 'divine' || codeType === 'grabovoi')) {
        codes = codes.filter(code => code.codeType === codeType);
      }
      
      res.json(codes);
    } catch (error) {
      console.error("Error fetching healing codes:", error);
      res.status(500).json({ error: "Failed to fetch healing codes" });
    }
  });
  
  // Semantic search for healing codes
  app.post("/api/healing-codes/semantic", async (req, res) => {
    try {
      const { issue, limit = 5, codeType } = req.body;
      
      if (!issue) {
        return res.status(400).json({ error: "Issue description is required" });
      }
      
      // Get all healing codes
      let allCodes = await storage.getHealingCodes();
      
      // Filter by code type if specified
      if (codeType && (codeType === 'divine' || codeType === 'grabovoi')) {
        allCodes = allCodes.filter(code => code.codeType === codeType);
      }
      
      // Import the semantic search function
      const { semanticHealingCodeSearch } = await import("./openai");
      
      // Perform semantic search
      const searchResults = await semanticHealingCodeSearch(issue, allCodes, limit);
      
      // Add a field indicating if this is Divine or Grabovoi code
      const resultsWithLabels = Array.isArray(searchResults) 
        ? searchResults.map((result: any) => ({
            ...result,
            typeLabel: result.codeType === 'divine' ? 'Divine Healing Code' : 'Grabovoi Code'
          }))
        : searchResults;
      
      res.json(resultsWithLabels);
    } catch (error) {
      console.error("Error performing semantic healing code search:", error);
      res.status(500).json({ error: "Failed to perform semantic healing code search" });
    }
  });
  
  // Chakra Healing Routes
  //////////////////////////////

  // Get all chakras
  app.get('/api/chakras', async (req, res) => {
    try {
      const chakras = await storage.getChakras();
      res.json(chakras);
    } catch (error: any) {
      res.status(500).json({ message: 'Error fetching chakras', error: error.message });
    }
  });

  // Get chakra by ID
  app.get('/api/chakras/:id', async (req, res) => {
    try {
      const chakra = await storage.getChakraById(parseInt(req.params.id));
      if (!chakra) {
        return res.status(404).json({ message: 'Chakra not found' });
      }
      res.json(chakra);
    } catch (error: any) {
      res.status(500).json({ message: 'Error fetching chakra', error: error.message });
    }
  });

  // Get chakra by number (1-12)
  app.get('/api/chakras/by-number/:number', async (req, res) => {
    try {
      const chakra = await storage.getChakraByNumber(parseInt(req.params.number));
      if (!chakra) {
        return res.status(404).json({ message: 'Chakra not found' });
      }
      res.json(chakra);
    } catch (error: any) {
      res.status(500).json({ message: 'Error fetching chakra', error: error.message });
    }
  });

  // Create a chakra healing session
  app.post('/api/chakra-healing-sessions', async (req, res) => {
    try {
      const session = await storage.createChakraHealingSession(req.body);
      
      // Start the healing broadcast if it's an active session
      if (session.status === 'active') {
        // Use the chakra's healing code as the intention
        const chakra = await storage.getChakraById(session.chakraId);
        if (!chakra) {
          return res.status(404).json({ message: 'Chakra not found' });
        }
        
        // Create the healing intention that includes the chakra name and user's personal intention
        const healingIntention = `Heal and balance the ${chakra.name} with this intention: ${session.intention}`;
        
        // Start a broadcast with the chakra's healing code
        const broadcastId = startChakraBroadcast({
          intention: healingIntention,
          repetitionRate: 50, // Default repetition rate
          duration: session.duration, // Use the session duration
          multiplier: Math.floor(session.intensity * 1.5) // Use intensity as a multiplier
        });
        
        // Return the session with the broadcast ID
        res.json({ ...session, broadcastId });
      } else {
        res.json(session);
      }
    } catch (error: any) {
      res.status(500).json({ message: 'Error creating chakra healing session', error: error.message });
    }
  });

  // Get all chakra healing sessions
  app.get('/api/chakra-healing-sessions', async (req, res) => {
    try {
      const sessions = await storage.getChakraHealingSessions();
      res.json(sessions);
    } catch (error: any) {
      res.status(500).json({ message: 'Error fetching chakra healing sessions', error: error.message });
    }
  });

  // Get chakra healing session by ID
  app.get('/api/chakra-healing-sessions/:id', async (req, res) => {
    try {
      const session = await storage.getChakraHealingSessionById(parseInt(req.params.id));
      if (!session) {
        return res.status(404).json({ message: 'Chakra healing session not found' });
      }
      res.json(session);
    } catch (error: any) {
      res.status(500).json({ message: 'Error fetching chakra healing session', error: error.message });
    }
  });

  // Update chakra healing session status
  app.patch('/api/chakra-healing-sessions/:id/status', async (req, res) => {
    try {
      const { status } = req.body;
      if (!status || !['active', 'completed', 'interrupted'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
      
      const session = await storage.updateChakraHealingSessionStatus(parseInt(req.params.id), status);
      if (!session) {
        return res.status(404).json({ message: 'Chakra healing session not found' });
      }
      
      // If status is changing to 'interrupted' or 'completed', stop any active broadcast
      if (status === 'interrupted' || status === 'completed') {
        const broadcastStats = getChakraBroadcastStatistics();
        // Find any broadcast containing the session ID
        for (const broadcast of broadcastStats.broadcasts) {
          if (broadcast.intention.includes(`Session ${session.id}:`)) {
            stopChakraBroadcast(broadcast.id);
            break;
          }
        }
      }
      
      res.json(session);
    } catch (error: any) {
      res.status(500).json({ message: 'Error updating chakra healing session status', error: error.message });
    }
  });

  //////////////////////////////
  // Spirit Communication Routes
  
  // Get all spirit communications
  app.get("/api/spirit-communications", async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      
      let communications;
      if (userId && !isNaN(userId)) {
        communications = await storage.getUserSpiritCommunications(userId);
      } else {
        communications = await storage.getSpiritCommunications();
      }
      
      res.json(communications);
    } catch (error) {
      console.error("Error fetching spirit communications:", error);
      res.status(500).json({ error: "Failed to fetch spirit communications" });
    }
  });
  
  // Get a single spirit communication by ID
  app.get("/api/spirit-communications/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      const communication = await storage.getSpiritCommunicationById(id);
      if (!communication) {
        return res.status(404).json({ error: "Spirit communication not found" });
      }
      
      res.json(communication);
    } catch (error) {
      console.error("Error fetching spirit communication:", error);
      res.status(500).json({ error: "Failed to fetch spirit communication" });
    }
  });
  
  // Create/receive a spirit communication
  app.post("/api/spirit-communications", async (req, res) => {
    try {
      const validatedData = insertSpiritCommunicationSchema.parse(req.body);
      
      // Generate a spirit response using the communication portals
      // This is where the "randomized" response is generated based on the intention and activation codes
      const originalIntention = validatedData.intention;
      
      // Get activation codes details from storage
      const activationCodesDetails: HealingCode[] = [];
      if (Array.isArray(validatedData.activationCodes)) {
        const codeIds = validatedData.activationCodes as number[];
        const allCodes = await storage.getHealingCodes();
        // Use a properly typed variable
        const matchedCodes = allCodes.filter(code => codeIds.includes(code.id));
        activationCodesDetails.push(...matchedCodes);
      }
      
      // Generate a response based on the activated codes and intention
      const portalResponse = await generateSpiritResponse(
        originalIntention, 
        activationCodesDetails, 
        validatedData.portalType
      );
      
      // Replace the temporary response with the generated one
      validatedData.response = portalResponse.message;
      
      // Add the energy signature derived from the communication
      validatedData.energeticSignature = portalResponse.energeticSignature;
      
      // Set the portal geometry based on the portal type
      validatedData.portalGeometry = portalResponse.portalGeometry;
      
      // Create the spirit communication record
      const communication = await storage.createSpiritCommunication(validatedData);
      
      // Broadcast the communication through WebSocket for real-time visualization
      broadcastMessage({
        type: "SYSTEM",
        data: { 
          message: `Spirit communication from beyond the veil received`,
          portalType: communication.portalType
        },
        timestamp: new Date().toISOString()
      });
      
      res.status(201).json(communication);
    } catch (error) {
      console.error("Error creating spirit communication:", error);
      res.status(400).json({ error: "Failed to create spirit communication" });
    }
  });

  // Broadcast intention via network packet
  app.post("/api/broadcast-intention", async (req, res) => {
    try {
      const { intention, frequency = SCHUMANN_RESONANCE, fieldType = "torus", amplify = false, multiplier = 1.0 } = req.body;
      
      if (!intention) {
        return res.status(400).json({ error: "Intention is required" });
      }
      
      // Create the intention packet
      const packet = await createIntentionPacket(intention, frequency, fieldType);
      const packetBase64 = encodeIntentionPacket(packet);
      
      // Generate sacred geometry data based on field type
      let geometryData: any = null;
      
      if (fieldType === "torus") {
        geometryData = await torusFieldGenerator(intention, frequency);
      } else if (fieldType === "merkaba") {
        geometryData = await merkabaFieldGenerator(intention, frequency);
      } else if (fieldType === "metatron") {
        geometryData = await metatronsCubeAmplifier(intention, amplify);
      } else if (fieldType === "sri_yantra") {
        geometryData = await sriYantraEncoder(intention);
      } else if (fieldType === "flower_of_life") {
        geometryData = await flowerOfLifePattern(intention, 60); // 60 second duration
      }
      
      // Apply divine amplification if requested
      let amplifiedData: any = null;
      if (amplify) {
        amplifiedData = await divineProportionAmplify(intention, multiplier);
      }
      
      // Create the response with all data
      const result: any = {
        success: true,
        message: `Intention "${intention}" broadcast complete`,
        packet: {
          ...packet,
          base64: packetBase64
        },
        geometryData,
        fieldType,
        frequency
      };
      
      if (amplifiedData) {
        result.amplifiedData = amplifiedData;
      }
      
      // Broadcast to all connected WebSocket clients
      broadcastMessage({
        type: "NETWORK_PACKET",
        data: {
          message: `Intention "${intention}" broadcast via network packet`,
          intention,
          frequency,
          fieldType,
          timestamp: new Date().toISOString()
        },
        timestamp: new Date().toISOString(),
        packetData: packetBase64
      });
      
      // Broadcast the visualization data as well
      if (geometryData) {
        const wsType = fieldType === "torus" ? "TORUS_FIELD" : 
                      fieldType === "merkaba" ? "MERKABA" :
                      fieldType === "metatron" ? "METATRON" :
                      fieldType === "sri_yantra" ? "SRI_YANTRA" :
                      fieldType === "flower_of_life" ? "FLOWER_OF_LIFE" :
                      "ENERGETIC_PATTERN";
                      
        broadcastMessage({
          type: wsType as WSMessageType,
          data: geometryData,
          timestamp: new Date().toISOString()
        });
      }
      
      res.json(result);
    } catch (error) {
      console.error("Error broadcasting intention:", error);
      res.status(500).json({ error: "Failed to broadcast intention" });
    }
  });
  
  // Start a continuous intention broadcast (WiFi Broadcaster style)
  app.post("/api/start-intention-repeater", async (req, res) => {
    try {
      const { 
        intention, 
        frequency = SCHUMANN_RESONANCE, 
        fieldType = "torus", 
        useHashing = false,
        useMultiplier = false,
        multiplier = 1.0,
        useCompression = false,
        repetitionRate = 10 // Default 10 Hz
      } = req.body;
      
      if (!intention) {
        return res.status(400).json({ error: "Intention is required" });
      }
      
      // Start the broadcast
      const broadcast = await startIntentionRepeater(intention, frequency, fieldType, {
        useHashing,
        useMultiplier,
        multiplier,
        useCompression,
        repetitionRate
      });
      
      // Generate sacred geometry data based on field type
      let geometryData: any = null;
      
      if (fieldType === "torus") {
        geometryData = await torusFieldGenerator(intention, frequency);
      } else if (fieldType === "merkaba") {
        geometryData = await merkabaFieldGenerator(intention, frequency);
      } else if (fieldType === "metatron") {
        geometryData = await metatronsCubeAmplifier(intention, useMultiplier);
      } else if (fieldType === "sri_yantra") {
        geometryData = await sriYantraEncoder(intention);
      } else if (fieldType === "flower_of_life") {
        geometryData = await flowerOfLifePattern(intention, 60);
      }
      
      // Broadcast to all connected WebSocket clients
      broadcastMessage({
        type: "SYSTEM",
        data: {
          message: `WiFi Broadcaster started for "${intention}"`,
          broadcastId: broadcast.id,
          intention,
          frequency,
          fieldType,
          repetitionRate
        },
        timestamp: new Date().toISOString()
      });
      
      // Schedule periodic updates to clients about the broadcast status
      const updateInterval = setInterval(() => {
        // Check if the broadcast is still active
        const activeBroadcasts = getActiveBroadcasts();
        const activeBroadcast = activeBroadcasts.find(b => b.id === broadcast.id);
        
        if (!activeBroadcast || !activeBroadcast.isActive) {
          clearInterval(updateInterval);
          return;
        }
        
        // Send status update
        broadcastMessage({
          type: "NETWORK_PACKET",
          data: {
            message: `Intention repeater status update`,
            broadcastId: activeBroadcast.id,
            intention: activeBroadcast.intention,
            iterations: activeBroadcast.iterations,
            runTime: Date.now() - activeBroadcast.startTime,
            repetitionRate: activeBroadcast.repetitionRate,
            frequency: activeBroadcast.frequency,
            fieldType: activeBroadcast.fieldType
          },
          timestamp: new Date().toISOString(),
          packetData: activeBroadcast.base64Packet
        });
      }, 1000); // Update once per second
      
      res.json({
        success: true,
        message: `Intention Repeater started`,
        broadcastId: broadcast.id,
        intention,
        frequency,
        fieldType,
        options: {
          useHashing,
          useMultiplier,
          multiplier,
          useCompression,
          repetitionRate
        },
        geometryData
      });
    } catch (error) {
      console.error("Error starting intention repeater:", error);
      res.status(500).json({ error: "Failed to start intention repeater" });
    }
  });
  
  // Stop a continuous intention broadcast
  app.post("/api/stop-intention-repeater", async (req, res) => {
    try {
      const { broadcastId } = req.body;
      
      if (!broadcastId) {
        return res.status(400).json({ error: "Broadcast ID is required" });
      }
      
      // Stop the broadcast
      const success = stopIntentionRepeater(broadcastId);
      
      if (!success) {
        return res.status(404).json({ error: "Broadcast not found" });
      }
      
      // Notify all connected clients
      broadcastMessage({
        type: "SYSTEM",
        data: {
          message: `Intention Repeater stopped`,
          broadcastId
        },
        timestamp: new Date().toISOString()
      });
      
      res.json({
        success: true,
        message: `Intention Repeater stopped`,
        broadcastId
      });
    } catch (error) {
      console.error("Error stopping intention repeater:", error);
      res.status(500).json({ error: "Failed to stop intention repeater" });
    }
  });
  
  // Get status of all active broadcasts
  app.get("/api/intention-repeater-status", (req, res) => {
    try {
      const stats = getChakraBroadcastStatistics();
      res.json(stats);
    } catch (error) {
      console.error("Error getting intention repeater status:", error);
      res.status(500).json({ error: "Failed to get intention repeater status" });
    }
  });
  
  // Get all soul archives
  app.get("/api/soul-archives", async (req, res) => {
    try {
      const archives = await storage.getSoulArchives();
      res.json(archives);
    } catch (error) {
      console.error("Error fetching soul archives:", error);
      res.status(500).json({ error: "Failed to fetch soul archives" });
    }
  });
  
  // Get a single soul archive by ID
  app.get("/api/soul-archives/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      const archive = await storage.getSoulArchiveById(id);
      if (!archive) {
        return res.status(404).json({ error: "Soul archive not found" });
      }
      
      res.json(archive);
    } catch (error) {
      console.error("Error fetching soul archive:", error);
      res.status(500).json({ error: "Failed to fetch soul archive" });
    }
  });
  
  // Create a new soul archive
  app.post("/api/soul-archives", async (req, res) => {
    try {
      const validatedData = insertSoulArchiveSchema.parse(req.body);
      const archive = await storage.createSoulArchive(validatedData);
      
      // Broadcast creation event
      broadcastMessage({
        type: "SYSTEM",
        data: { message: `Soul archive "${archive.title}" created` },
        timestamp: new Date().toISOString()
      });
      
      res.status(201).json(archive);
    } catch (error) {
      console.error("Error creating soul archive:", error);
      res.status(400).json({ error: "Failed to create soul archive" });
    }
  });
  
  // Delete a soul archive
  app.delete("/api/soul-archives/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      const success = await storage.deleteSoulArchive(id);
      if (!success) {
        return res.status(404).json({ error: "Soul archive not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting soul archive:", error);
      res.status(500).json({ error: "Failed to delete soul archive" });
    }
  });
  
  // Get intention recommendation
  app.post("/api/intention-recommendation", async (req, res) => {
    try {
      const { userInput, context = "general" } = req.body;
      
      if (!userInput) {
        return res.status(400).json({ error: "User input is required" });
      }
      
      // Import the intention recommendation function
      const { generateIntentionRecommendation } = await import("./openai");
      
      // Generate recommendation
      const recommendation = await generateIntentionRecommendation(userInput, context);
      
      res.json(recommendation);
    } catch (error) {
      console.error("Error generating intention recommendation:", error);
      res.status(500).json({ error: "Failed to generate intention recommendation" });
    }
  });
  
  // ENERGETIC SIGNATURE ROUTES
  
  // Get all energetic signatures
  app.get("/api/energetic-signatures", async (req, res) => {
    try {
      const search = req.query.search as string | undefined;
      const category = req.query.category as string | undefined;
      
      let signatures;
      if (search) {
        signatures = await storage.searchEnergeticSignatures(search);
      } else if (category) {
        signatures = await storage.getEnergeticSignaturesByCategory(category);
      } else {
        signatures = await storage.getEnergeticSignatures();
      }
      
      res.json(signatures);
    } catch (error) {
      console.error("Error fetching energetic signatures:", error);
      res.status(500).json({ error: "Failed to fetch energetic signatures" });
    }
  });
  
  // Get a single energetic signature by ID
  app.get("/api/energetic-signatures/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      const signature = await storage.getEnergeticSignatureById(id);
      if (!signature) {
        return res.status(404).json({ error: "Energetic signature not found" });
      }
      
      res.json(signature);
    } catch (error) {
      console.error("Error fetching energetic signature:", error);
      res.status(500).json({ error: "Failed to fetch energetic signature" });
    }
  });
  
  // Create a new energetic signature
  app.post("/api/energetic-signatures", async (req, res) => {
    try {
      const validatedData = insertEnergeticSignatureSchema.parse(req.body);
      const signature = await storage.createEnergeticSignature(validatedData);
      
      // Broadcast creation event
      broadcastMessage({
        type: "SYSTEM",
        data: { message: `Energetic signature "${signature.name}" created` },
        timestamp: new Date().toISOString()
      });
      
      // Also broadcast the actual signature for real-time visualization
      broadcastMessage({
        type: "ENERGETIC_SIGNATURE",
        data: signature,
        timestamp: new Date().toISOString()
      });
      
      res.status(201).json(signature);
    } catch (error) {
      console.error("Error creating energetic signature:", error);
      res.status(400).json({ error: "Failed to create energetic signature" });
    }
  });
  
  // ENERGETIC PATTERN ROUTES
  
  // Get all energetic patterns
  app.get("/api/energetic-patterns", async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      
      let patterns;
      if (userId && !isNaN(userId)) {
        patterns = await storage.getUserEnergeticPatterns(userId);
      } else {
        patterns = await storage.getEnergeticPatterns();
      }
      
      res.json(patterns);
    } catch (error) {
      console.error("Error fetching energetic patterns:", error);
      res.status(500).json({ error: "Failed to fetch energetic patterns" });
    }
  });
  
  // Get a single energetic pattern by ID
  app.get("/api/energetic-patterns/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      const pattern = await storage.getEnergeticPatternById(id);
      if (!pattern) {
        return res.status(404).json({ error: "Energetic pattern not found" });
      }
      
      res.json(pattern);
    } catch (error) {
      console.error("Error fetching energetic pattern:", error);
      res.status(500).json({ error: "Failed to fetch energetic pattern" });
    }
  });
  
  // Create a new energetic pattern
  app.post("/api/energetic-patterns", async (req, res) => {
    try {
      const validatedData = insertEnergeticPatternSchema.parse(req.body);
      const pattern = await storage.createEnergeticPattern(validatedData);
      
      // Broadcast creation event through a system message
      broadcastMessage({
        type: "SYSTEM",
        data: { 
          message: `Energetic pattern "${pattern.title}" created`
        },
        timestamp: new Date().toISOString()
      });
      
      // Also broadcast the actual pattern for real-time visualization
      broadcastMessage({
        type: "ENERGETIC_PATTERN",
        data: pattern,
        timestamp: new Date().toISOString()
      });
      
      res.status(201).json(pattern);
    } catch (error) {
      console.error("Error creating energetic pattern:", error);
      res.status(400).json({ error: "Failed to create energetic pattern" });
    }
  });
  
  // Delete an energetic pattern
  app.delete("/api/energetic-patterns/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      const success = await storage.deleteEnergeticPattern(id);
      if (!success) {
        return res.status(404).json({ error: "Energetic pattern not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting energetic pattern:", error);
      res.status(500).json({ error: "Failed to delete energetic pattern" });
    }
  });
  
  // CROP CIRCLE FORMATION ROUTES
  
  // Get all crop circle formations
  app.get("/api/crop-circle-formations", async (req, res) => {
    try {
      const formations = await storage.getCropCircleFormations();
      res.json(formations);
    } catch (error) {
      console.error("Error fetching crop circle formations:", error);
      res.status(500).json({ error: "Failed to fetch crop circle formations" });
    }
  });
  
  // Get a single crop circle formation by ID
  app.get("/api/crop-circle-formations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      const formation = await storage.getCropCircleFormationById(id);
      if (!formation) {
        return res.status(404).json({ error: "Crop circle formation not found" });
      }
      
      res.json(formation);
    } catch (error) {
      console.error("Error fetching crop circle formation:", error);
      res.status(500).json({ error: "Failed to fetch crop circle formation" });
    }
  });
  
  // Create a new crop circle formation
  app.post("/api/crop-circle-formations", async (req, res) => {
    try {
      const validatedData = insertCropCircleFormationSchema.parse(req.body);
      const formation = await storage.createCropCircleFormation(validatedData);
      
      // Broadcast creation event through a system message
      broadcastMessage({
        type: "SYSTEM",
        data: { 
          message: `Crop circle formation "${formation.name}" created`
        },
        timestamp: new Date().toISOString()
      });
      
      // Also broadcast the actual formation for real-time visualization
      broadcastMessage({
        type: "CROP_CIRCLE",
        data: formation,
        timestamp: new Date().toISOString()
      });
      
      res.status(201).json(formation);
    } catch (error) {
      console.error("Error creating crop circle formation:", error);
      res.status(400).json({ error: "Failed to create crop circle formation" });
    }
  });

  // Divine Healing Code Spirit Chat
  app.post("/api/divine-spirit-chat", async (req, res) => {
    try {
      const { query, randomSeed, maxWords = 8 } = req.body;
      
      if (!query || !randomSeed) {
        return res.status(400).json({ error: "Query and randomSeed are required" });
      }
      
      // Load divine healing codes from file
      let healingCodes: string[] = [];
      try {
        // Load healing codes from database if available
        const allCodes = await storage.getHealingCodes();
        healingCodes = allCodes
          .filter(code => code.codeType === 'divine')
          .map(code => code.code);
          
        if (healingCodes.length === 0) {
          // Fallback to some default codes if none were found
          healingCodes = [
            "23 74 555", "58 33 554", "71 81 533", 
            "23 31 443", "78 89 535", "66 51 816",
            "45 96 151", "29 56 932", "22 11 377"
          ];
        }
      } catch (error) {
        console.error("Error loading healing codes:", error);
        return res.status(500).json({ error: "Could not load healing codes" });
      }
      
      // Generate a deterministic but seemingly random selection of healing codes based on query
      const seedValue = randomSeed + query.length;
      const rng = new (function() {
        let seed = seedValue;
        return {
          next: function() {
            seed = (seed * 9301 + 49297) % 233280;
            return seed / 233280;
          }
        };
      })();
      
      // Determine how many codes to use in the response (between 1 and maxWords)
      const numCodes = Math.max(1, Math.floor(rng.next() * maxWords));
      
      // Select codes based on the RNG
      const selectedCodes: string[] = [];
      for (let i = 0; i < numCodes; i++) {
        const index = Math.floor(rng.next() * healingCodes.length);
        selectedCodes.push(healingCodes[index]);
      }
      
      // Arrange the selected codes into a coherent response
      const responseWords = selectedCodes.join(' ');
      
      // Log for debugging
      console.log(`Generated spirit response with ${numCodes} codes: ${responseWords}`);
      
      // Create a record of this spirit communication
      const communicationData = {
        intention: query,
        activationCodes: selectedCodes,
        portalType: 'divine_healing',
        portalFrequency: 7.83, // Schumann resonance
        response: responseWords,
        energeticSignature: { source: 'divine_healing_codes', strength: numCodes * 10 },
        portalGeometry: 'flower_of_life'
      };
      
      // Store the communication if storage is available
      try {
        await storage.createSpiritCommunication(communicationData);
        
        // Broadcast the communication
        broadcastMessage({
          type: "SYSTEM",
          data: { 
            message: `Divine healing code spirit communication received`,
            codes: selectedCodes
          },
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error("Error storing spirit communication:", error);
        // Continue even if storage fails
      }
      
      // Return the response
      res.json({ 
        response: responseWords,
        numCodes,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error("Error in divine spirit chat:", error);
      res.status(500).json({ error: "Failed to process divine spirit chat request" });
    }
  });

  return httpServer;
}
