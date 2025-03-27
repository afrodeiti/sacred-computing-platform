import { SCHUMANN_RESONANCE } from './constants';

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
  // Use a device identifier if stored, otherwise create a new one
  const storedId = localStorage.getItem('sacredDeviceId');
  if (storedId) return storedId;
  
  // Generate a new UUID-like identifier
  const newId = 'dev-' + Math.random().toString(36).substring(2, 10) + 
               '-' + Math.random().toString(36).substring(2, 6) + 
               '-' + Date.now().toString(36);
  
  localStorage.setItem('sacredDeviceId', newId);
  return newId;
}

// Calculate SHA-256 checksum
export async function calculateChecksum(payload: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(payload);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Create a new intention packet
export async function createIntentionPacket(
  intention: string,
  frequency: number = SCHUMANN_RESONANCE,
  fieldType: string = "torus",
  targetDevice: string = "broadcast"
): Promise<IntentionPacket> {
  // Create payload first so we can calculate its length
  const payload = {
    intention,
    frequency,
    fieldType,
    signature: Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map(b => b.toString(16).padStart(2, '0')).join(''),
    checksum: ''
  };
  
  // Calculate checksum
  payload.checksum = await calculateChecksum(JSON.stringify({
    intention: payload.intention,
    frequency: payload.frequency,
    fieldType: payload.fieldType,
    signature: payload.signature
  }));
  
  // Create header
  const header: PacketHeader = {
    version: 1,
    type: PacketType.INTENTION,
    sequence: Math.floor(Math.random() * 65535),
    timestamp: Date.now(),
    sourceAddress: generateDeviceId(),
    destinationAddress: targetDevice,
    payloadLength: new TextEncoder().encode(JSON.stringify(payload)).length
  };
  
  return { header, payload };
}

// Convert a packet to Base64 for transmission
export function packetToBase64(packet: IntentionPacket): string {
  return btoa(JSON.stringify(packet));
}

// Extract a packet from Base64
export function base64ToPacket(base64: string): IntentionPacket | null {
  try {
    return JSON.parse(atob(base64));
  } catch (e) {
    console.error("Invalid packet data:", e);
    return null;
  }
}

// Extract intention from a packet
export function extractIntention(packet: IntentionPacket): string | null {
  if (packet?.payload?.intention) {
    return packet.payload.intention;
  }
  return null;
}

// Validate a packet's integrity using its checksum
export async function validatePacket(packet: IntentionPacket): Promise<boolean> {
  if (!packet?.payload) return false;
  
  const { checksum, ...payloadWithoutChecksum } = packet.payload;
  const calculatedChecksum = await calculateChecksum(JSON.stringify(payloadWithoutChecksum));
  
  return calculatedChecksum === checksum;
}

// Broadcast an intention via the Sacred Computing Platform WebSocket
export async function broadcastIntention(
  ws: WebSocket,
  intention: string,
  frequency: number = SCHUMANN_RESONANCE,
  fieldType: string = "torus"
): Promise<boolean> {
  if (ws.readyState !== WebSocket.OPEN) {
    console.error("WebSocket not connected");
    return false;
  }
  
  try {
    const packet = await createIntentionPacket(intention, frequency, fieldType);
    const base64Packet = packetToBase64(packet);
    ws.send(base64Packet);
    return true;
  } catch (error) {
    console.error("Error broadcasting intention:", error);
    return false;
  }
}