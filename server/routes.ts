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
import { 
  insertSoulArchiveSchema, 
  insertEnergeticSignatureSchema, 
  insertEnergeticPatternSchema,
  insertCropCircleFormationSchema
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
          const { formationId } = parsedMessage.data;
          
          if (!formationId) {
            throw new Error("Formation ID is required");
          }
          
          // Get the crop circle formation from storage
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

  return httpServer;
}
