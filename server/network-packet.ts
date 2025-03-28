// Network packet implementation for intention broadcasting
// Based on principles from the Intention Repeater WiFi Broadcaster
import { createHash, randomBytes } from "crypto";
import { SCHUMANN_RESONANCE } from "./sacred-geometry";

// Packet types
export enum PacketType {
  DATA = 0,          // Regular data packet
  INTENTION = 1,     // Sacred intention packet
  SACRED_GEOMETRY = 2, // Sacred geometry pattern
  FIELD_HARMONICS = 3, // Field harmonization
  QUANTUM_RESONANCE = 4, // Quantum resonance pattern
  REPEATER = 5,      // Intention repeater packet
}

// IEEE 802.11 inspired packet header
export interface PacketHeader {
  version: number;            // Protocol version
  type: PacketType;           // Packet type
  sequence: number;           // Sequence number
  timestamp: number;          // Timestamp in ms
  sourceAddress: string;      // Source identifier (device/user)
  destinationAddress: string; // Destination (broadcast or specific)
  payloadLength: number;      // Length of the payload in bytes
  repetitionCount?: number;   // For repeater packets - how many times it has been repeated
}

// Complete network packet with intention data
export interface IntentionPacket {
  header: PacketHeader;
  payload: {
    intention: string;         // The intention text
    frequency: number;         // Frequency in Hz (default: Schumann resonance)
    fieldType: string;         // Sacred geometry field type
    signature: string;         // Quantum signature
    checksum: string;          // SHA-256 checksum of the payload
    repeaterOptions?: {
      useHashing?: boolean;    // Whether to hash the intention for strengthening
      useMultiplier?: boolean; // Whether to multiply the intention
      multiplier?: number;     // Multiplication factor
      useCompression?: boolean; // Whether to compress the packet for energetic density
    }
  }
}

// Active broadcasts store
export interface ActiveBroadcast {
  id: string;
  intention: string;
  frequency: number;
  fieldType: string;
  packet: IntentionPacket;
  base64Packet: string;
  iterations: number;
  startTime: number;
  lastUpdate: number;
  repetitionRate: number; // Hz
  isActive: boolean;
}

// Generate a unique device identifier
export function generateDeviceId(): string {
  // Generate a device-like identifier
  return 'server-' + randomBytes(4).toString('hex') + 
         '-' + Date.now().toString(36);
}

// Calculate SHA-256 checksum
export function calculateChecksum(payload: string): string {
  return createHash('sha256').update(payload).digest('hex');
}

// Create a new intention packet
export async function createIntentionPacket(
  intention: string,
  frequency: number = SCHUMANN_RESONANCE,
  fieldType: string = "torus",
  targetDevice: string = "broadcast"
): Promise<IntentionPacket> {
  // Create payload first so we can calculate its length
  const signature = randomBytes(16).toString('hex');
  
  // Create payload object without checksum first
  const payloadData = {
    intention,
    frequency,
    fieldType,
    signature
  };
  
  // Calculate checksum
  const checksum = calculateChecksum(JSON.stringify(payloadData));
  
  // Full payload with checksum
  const payload = {
    ...payloadData,
    checksum
  };
  
  // Encode as string to calculate length
  const payloadStr = JSON.stringify(payload);
  
  // Create header
  const header: PacketHeader = {
    version: 1,
    type: PacketType.INTENTION,
    sequence: Math.floor(Math.random() * 65535),
    timestamp: Date.now(),
    sourceAddress: generateDeviceId(),
    destinationAddress: targetDevice,
    payloadLength: Buffer.byteLength(payloadStr, 'utf8')
  };
  
  return { header, payload };
}

// Embed intention in a network packet
export async function embedIntentionInNetworkPacket(
  intention: string,
  frequency: number = SCHUMANN_RESONANCE,
  fieldType: string = "torus"
): Promise<string> {
  const packet = await createIntentionPacket(intention, frequency, fieldType);
  return encodeIntentionPacket(packet);
}

// Encode the packet as a base64 string
export function encodeIntentionPacket(packet: IntentionPacket): string {
  const packetStr = JSON.stringify(packet);
  return Buffer.from(packetStr).toString('base64');
}

// Decode a base64 packet
export function decodeIntentionPacket(base64Packet: string): IntentionPacket | null {
  try {
    const packetStr = Buffer.from(base64Packet, 'base64').toString('utf8');
    return JSON.parse(packetStr);
  } catch (error) {
    console.error("Error decoding packet:", error);
    return null;
  }
}

// Extract intention from a base64-encoded packet
export function extractIntentionFromPacket(base64Packet: string): string | null {
  try {
    const packet = decodeIntentionPacket(base64Packet);
    if (packet?.payload?.intention) {
      return packet.payload.intention;
    }
    return null;
  } catch (error) {
    console.error("Error extracting intention:", error);
    return null;
  }
}

// Verify packet integrity
export function verifyIntentionPacket(packet: IntentionPacket): boolean {
  try {
    const { payload } = packet;
    const { checksum, ...payloadWithoutChecksum } = payload;
    
    const calculatedChecksum = calculateChecksum(JSON.stringify(payloadWithoutChecksum));
    return calculatedChecksum === checksum;
  } catch (error) {
    console.error("Error verifying packet:", error);
    return false;
  }
}

// Storage for active broadcast repeaters
const activeBroadcasts = new Map<string, ActiveBroadcast>();

// Get active broadcasts
export function getActiveBroadcasts(): ActiveBroadcast[] {
  return Array.from(activeBroadcasts.values());
}

// Start a new intention repeater broadcast
export async function startIntentionRepeater(
  intention: string,
  frequency: number = SCHUMANN_RESONANCE,
  fieldType: string = "torus",
  options: {
    useHashing?: boolean,
    useMultiplier?: boolean,
    multiplier?: number,
    useCompression?: boolean,
    repetitionRate?: number // Hz - how many times per second to repeat
  } = {}
): Promise<ActiveBroadcast> {
  // Default options
  const repeaterOptions = {
    useHashing: options.useHashing || false,
    useMultiplier: options.useMultiplier || false,
    multiplier: options.multiplier || 1,
    useCompression: options.useCompression || false
  };
  
  // Create a base packet
  const packet = await createIntentionPacket(intention, frequency, fieldType);
  
  // Add repeater options
  packet.header.type = PacketType.REPEATER;
  packet.header.repetitionCount = 0;
  packet.payload.repeaterOptions = repeaterOptions;
  
  // Encode packet
  const base64Packet = encodeIntentionPacket(packet);
  
  // Create new broadcast record
  const id = `broadcast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const now = Date.now();
  const broadcast: ActiveBroadcast = {
    id,
    intention,
    frequency,
    fieldType,
    packet,
    base64Packet,
    iterations: 0,
    startTime: now,
    lastUpdate: now,
    repetitionRate: options.repetitionRate || 10, // Default 10 Hz
    isActive: true
  };
  
  // Store the broadcast
  activeBroadcasts.set(id, broadcast);
  
  // Start broadcasting process
  setTimeout(() => broadcastCycle(id), 0);
  
  return broadcast;
}

// Stop an intention repeater broadcast
export function stopIntentionRepeater(id: string): boolean {
  if (activeBroadcasts.has(id)) {
    const broadcast = activeBroadcasts.get(id)!;
    broadcast.isActive = false;
    // Wait a moment before removing from map to allow final stats to be read
    setTimeout(() => activeBroadcasts.delete(id), 5000);
    return true;
  }
  return false;
}

// Process a single broadcast cycle
async function broadcastCycle(id: string): Promise<void> {
  if (!activeBroadcasts.has(id)) return;
  
  const broadcast = activeBroadcasts.get(id)!;
  if (!broadcast.isActive) return;
  
  // Update packet with latest iteration count
  broadcast.packet.header.repetitionCount = ++broadcast.iterations;
  broadcast.packet.header.timestamp = Date.now();
  broadcast.lastUpdate = Date.now();
  
  // Apply hashing if enabled (similar to Intention Repeater WiFi)
  let processedIntention = broadcast.intention;
  if (broadcast.packet.payload.repeaterOptions?.useHashing) {
    processedIntention = calculateChecksum(processedIntention);
  }
  
  // Apply multiplier if enabled
  if (broadcast.packet.payload.repeaterOptions?.useMultiplier && 
      broadcast.packet.payload.repeaterOptions?.multiplier && 
      broadcast.packet.payload.repeaterOptions.multiplier > 1) {
    // Simple implementation - in a real system this would use buffer multiplication
    const multiplier = broadcast.packet.payload.repeaterOptions.multiplier;
    processedIntention = processedIntention.repeat(Math.min(multiplier, 100));
  }
  
  // Update the packet
  broadcast.packet.payload.intention = processedIntention;
  broadcast.base64Packet = encodeIntentionPacket(broadcast.packet);
  
  // Calculate delay for next cycle based on repetition rate
  const delay = Math.floor(1000 / broadcast.repetitionRate);
  
  // Schedule next cycle
  setTimeout(() => broadcastCycle(id), delay);
}

// Get statistics for all active broadcasts
export function getBroadcastStatistics(): any {
  const stats = {
    activeCount: activeBroadcasts.size,
    totalIterations: 0,
    broadcasts: [] as Array<{
      id: string,
      intention: string,
      iterations: number,
      runTime: number, // ms
      repetitionRate: number // Hz
    }>
  };
  
  // Convert to array first to avoid iteration issues
  const broadcastsArray = Array.from(activeBroadcasts.values());
  
  for (const broadcast of broadcastsArray) {
    stats.totalIterations += broadcast.iterations;
    stats.broadcasts.push({
      id: broadcast.id,
      intention: broadcast.intention,
      iterations: broadcast.iterations,
      runTime: Date.now() - broadcast.startTime,
      repetitionRate: broadcast.repetitionRate
    });
  }
  
  return stats;
}