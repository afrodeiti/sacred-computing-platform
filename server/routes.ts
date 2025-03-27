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
  sriYantraEncoder
} from "./sacred-geometry";
import { 
  embedIntentionInNetworkPacket, 
  PacketType,
  encodeIntentionPacket 
} from "./network-packet";
import { z } from "zod";
import { insertSoulArchiveSchema } from "@shared/schema";

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

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
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
      
      let codes;
      if (search) {
        codes = await storage.searchHealingCodes(search);
      } else if (category) {
        codes = await storage.getHealingCodesByCategory(category);
      } else {
        codes = await storage.getHealingCodes();
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
      const { issue, limit = 5 } = req.body;
      
      if (!issue) {
        return res.status(400).json({ error: "Issue description is required" });
      }
      
      // Get all healing codes
      const allCodes = await storage.getHealingCodes();
      
      // For now we'll use a simple keyword search as we don't have OpenAI in this environment
      // In the Python implementation, this is handled by the semantic matching function
      const searchResults = await storage.searchHealingCodes(issue);
      
      res.json({
        matched_codes: searchResults.slice(0, limit),
        semantic_match: false, 
        explanation: "Basic keyword matching was used. For semantic matching, the backend would use OpenAI integration.",
        recommended_practice: "Recite each code 9 times daily while focusing on your intention of healing."
      });
    } catch (error) {
      console.error("Error performing semantic healing code search:", error);
      res.status(500).json({ error: "Failed to perform semantic healing code search" });
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
      
      // Context-specific intention recommendations
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
      
      res.json({
        original_input: userInput,
        recommended_intention: recommended,
        reason: reason,
        suggested_field_type: fieldType,
        suggested_frequency: frequency
      });
    } catch (error) {
      console.error("Error generating intention recommendation:", error);
      res.status(500).json({ error: "Failed to generate intention recommendation" });
    }
  });

  return httpServer;
}
