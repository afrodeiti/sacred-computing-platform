// Network packet implementation for intention broadcasting
import { createHash, randomBytes } from "crypto";
import { SCHUMANN_RESONANCE } from "./sacred-geometry";

// Packet types
export enum PacketType {
  DATA = 0,          // Regular data packet
  INTENTION = 1,     // Sacred intention packet
  SACRED_GEOMETRY = 2, // Sacred geometry pattern
  FIELD_HARMONICS = 3, // Field harmonization
  QUANTUM_RESONANCE = 4, // Quantum resonance pattern
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
  }
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