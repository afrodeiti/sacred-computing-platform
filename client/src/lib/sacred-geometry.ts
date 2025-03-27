import { PHI, SCHUMANN_RESONANCE } from "./constants";

// Sacred geometry field types
export type FieldType = "torus" | "merkaba" | "metatron" | "sri_yantra" | "flower_of_life" | "platonic_solid";

// Sacred geometry field data interfaces
export interface TorusField {
  frequency: number;
  radius: number;
  inner_radius: number;
  rotation_speed: number;
  quantum_signature: string;
  intention_hash: string;
  field_strength: number;
  color_spectrum: string[];
  resonance_points: {x: number, y: number, z: number}[];
}

export interface MerkabaField {
  frequency: number;
  tetrahedron_size: number;
  rotation_speed: number;
  quantum_signature: string;
  intention_hash: string;
  field_strength: number;
  color_spectrum: string[];
  resonance_points: {x: number, y: number, z: number}[];
}

export interface MetatronField {
  boost: boolean;
  node_count: number;
  connection_strength: number;
  quantum_signature: string;
  intention_hash: string;
  field_strength: number;
  color_spectrum: string[];
  platonic_solids: string[];
}

export interface SriYantraField {
  triangle_count: number;
  precision_level: number;
  quantum_signature: string;
  intention_hash: string;
  field_strength: number;
  color_spectrum: string[];
  bindu_intensity: number;
}

export interface FlowerOfLifeField {
  circle_count: number;
  duration: number;
  quantum_signature: string;
  intention_hash: string;
  field_strength: number;
  color_spectrum: string[];
  life_force_intensity: number;
}

export interface PlatonicSolidField {
  solid_type: "tetrahedron" | "hexahedron" | "octahedron" | "dodecahedron" | "icosahedron";
  element: "fire" | "earth" | "air" | "ether" | "water";
  quantum_signature: string;
  intention_hash: string;
  field_strength: number;
  color_spectrum: string[];
  vertices: {x: number, y: number, z: number}[];
}

export type SacredGeometryField = 
  | { type: "torus", data: TorusField }
  | { type: "merkaba", data: MerkabaField }
  | { type: "metatron", data: MetatronField }
  | { type: "sri_yantra", data: SriYantraField }
  | { type: "flower_of_life", data: FlowerOfLifeField }
  | { type: "platonic_solid", data: PlatonicSolidField };

// Utility functions
export function hashIntention(intention: string): string {
  // Simple hash function for demonstration
  let hash = 0;
  for (let i = 0; i < intention.length; i++) {
    const char = intention.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(16).padStart(8, '0');
}

export function generateQuantumSignature(): string {
  // Generate a random quantum signature
  const bytes = new Uint8Array(16);
  window.crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Sacred geometry field generators
export function generateTorusField(intention: string, frequency: number = SCHUMANN_RESONANCE): TorusField {
  const fieldStrength = 0.5 + Math.random() * 0.5; // 0.5 to 1.0
  
  return {
    frequency,
    radius: 3 + Math.random() * 2,
    inner_radius: 1 + Math.random(),
    rotation_speed: 0.01 + Math.random() * 0.02,
    quantum_signature: generateQuantumSignature(),
    intention_hash: hashIntention(intention),
    field_strength: fieldStrength,
    color_spectrum: [
      `hsl(${Math.floor(Math.random() * 360)}, 80%, 50%)`,
      `hsl(${Math.floor(Math.random() * 360)}, 80%, 50%)`,
      `hsl(${Math.floor(Math.random() * 360)}, 80%, 50%)`
    ],
    resonance_points: Array(7).fill(0).map(() => ({
      x: (Math.random() * 2 - 1) * 10,
      y: (Math.random() * 2 - 1) * 10,
      z: (Math.random() * 2 - 1) * 10
    }))
  };
}

export function generateMerkabaField(intention: string, frequency: number = SCHUMANN_RESONANCE): MerkabaField {
  const fieldStrength = 0.6 + Math.random() * 0.4; // 0.6 to 1.0 (stronger)
  
  return {
    frequency,
    tetrahedron_size: 2 + Math.random() * 3,
    rotation_speed: 0.015 + Math.random() * 0.025,
    quantum_signature: generateQuantumSignature(),
    intention_hash: hashIntention(intention),
    field_strength: fieldStrength,
    color_spectrum: [
      `hsl(${180 + Math.floor(Math.random() * 60)}, 80%, 60%)`, // Cyan/Blue
      `hsl(${270 + Math.floor(Math.random() * 60)}, 80%, 60%)`, // Purple
      `hsl(${0 + Math.floor(Math.random() * 30)}, 80%, 60%)` // Red
    ],
    resonance_points: Array(12).fill(0).map(() => ({
      x: (Math.random() * 2 - 1) * 10,
      y: (Math.random() * 2 - 1) * 10,
      z: (Math.random() * 2 - 1) * 10
    }))
  };
}

export function generateMetatronField(intention: string, boost: boolean = false): MetatronField {
  const fieldStrength = boost ? 0.8 + Math.random() * 0.2 : 0.5 + Math.random() * 0.3;
  const nodeCount = boost ? 13 : 7;
  
  return {
    boost,
    node_count: nodeCount,
    connection_strength: 0.7 + Math.random() * 0.3,
    quantum_signature: generateQuantumSignature(),
    intention_hash: hashIntention(intention),
    field_strength: fieldStrength,
    color_spectrum: [
      `hsl(${290 + Math.floor(Math.random() * 30)}, 80%, 60%)`, // Purple
      `hsl(${40 + Math.floor(Math.random() * 20)}, 80%, 60%)`, // Gold
      `hsl(${120 + Math.floor(Math.random() * 30)}, 80%, 60%)` // Green
    ],
    platonic_solids: [
      "tetrahedron",
      "hexahedron",
      "octahedron",
      "dodecahedron",
      "icosahedron"
    ]
  };
}

export function generateSriYantraField(intention: string): SriYantraField {
  const fieldStrength = 0.7 + Math.random() * 0.3; // 0.7 to 1.0 (stronger)
  
  return {
    triangle_count: 9,
    precision_level: 0.85 + Math.random() * 0.15,
    quantum_signature: generateQuantumSignature(),
    intention_hash: hashIntention(intention),
    field_strength: fieldStrength,
    color_spectrum: [
      `hsl(${350 + Math.floor(Math.random() * 20)}, 80%, 60%)`, // Red
      `hsl(${290 + Math.floor(Math.random() * 30)}, 80%, 60%)`, // Purple
      `hsl(${30 + Math.floor(Math.random() * 20)}, 80%, 60%)` // Orange
    ],
    bindu_intensity: 0.9 + Math.random() * 0.1
  };
}

export function generateFlowerOfLifeField(intention: string, duration: number = 60): FlowerOfLifeField {
  const fieldStrength = 0.65 + Math.random() * 0.35; // 0.65 to 1.0
  
  return {
    circle_count: 19,
    duration,
    quantum_signature: generateQuantumSignature(),
    intention_hash: hashIntention(intention),
    field_strength: fieldStrength,
    color_spectrum: [
      `hsl(${200 + Math.floor(Math.random() * 40)}, 80%, 60%)`, // Blue
      `hsl(${120 + Math.floor(Math.random() * 30)}, 80%, 60%)`, // Green
      `hsl(${40 + Math.floor(Math.random() * 20)}, 80%, 60%)` // Gold
    ],
    life_force_intensity: 0.8 + Math.random() * 0.2
  };
}

export function generatePlatonicSolidField(
  intention: string, 
  solidType: "tetrahedron" | "hexahedron" | "octahedron" | "dodecahedron" | "icosahedron" = "dodecahedron"
): PlatonicSolidField {
  const elementMap = {
    tetrahedron: "fire",
    hexahedron: "earth",
    octahedron: "air",
    dodecahedron: "ether",
    icosahedron: "water"
  } as const;
  
  const fieldStrength = 0.6 + Math.random() * 0.4;

  // Simplified vertices for each platonic solid
  const getVertices = () => {
    switch(solidType) {
      case "tetrahedron":
        return [
          {x: 1, y: 1, z: 1}, {x: -1, y: -1, z: 1},
          {x: -1, y: 1, z: -1}, {x: 1, y: -1, z: -1}
        ];
      case "hexahedron": // cube
        return [
          {x: 1, y: 1, z: 1}, {x: -1, y: 1, z: 1},
          {x: -1, y: -1, z: 1}, {x: 1, y: -1, z: 1},
          {x: 1, y: 1, z: -1}, {x: -1, y: 1, z: -1},
          {x: -1, y: -1, z: -1}, {x: 1, y: -1, z: -1}
        ];
      case "octahedron":
        return [
          {x: 1, y: 0, z: 0}, {x: -1, y: 0, z: 0},
          {x: 0, y: 1, z: 0}, {x: 0, y: -1, z: 0},
          {x: 0, y: 0, z: 1}, {x: 0, y: 0, z: -1}
        ];
      case "dodecahedron":
        const phi = PHI;
        return [
          {x: 1, y: 1, z: 1}, {x: 1, y: 1, z: -1}, 
          {x: 1, y: -1, z: 1}, {x: 1, y: -1, z: -1},
          {x: -1, y: 1, z: 1}, {x: -1, y: 1, z: -1},
          {x: -1, y: -1, z: 1}, {x: -1, y: -1, z: -1},
          {x: 0, y: phi, z: 1/phi}, {x: 0, y: phi, z: -1/phi},
          {x: 0, y: -phi, z: 1/phi}, {x: 0, y: -phi, z: -1/phi},
          {x: 1/phi, y: 0, z: phi}, {x: -1/phi, y: 0, z: phi},
          {x: 1/phi, y: 0, z: -phi}, {x: -1/phi, y: 0, z: -phi},
          {x: phi, y: 1/phi, z: 0}, {x: phi, y: -1/phi, z: 0},
          {x: -phi, y: 1/phi, z: 0}, {x: -phi, y: -1/phi, z: 0}
        ];
      case "icosahedron":
        return Array(12).fill(0).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const nextAngle = ((i + 1) / 12) * Math.PI * 2;
          return {
            x: Math.cos(angle),
            y: Math.sin(angle),
            z: i % 2 === 0 ? 0.5 : -0.5
          };
        });
    }
  };
  
  return {
    solid_type: solidType,
    element: elementMap[solidType],
    quantum_signature: generateQuantumSignature(),
    intention_hash: hashIntention(intention),
    field_strength: fieldStrength,
    color_spectrum: [
      `hsl(${Math.floor(Math.random() * 360)}, 80%, 60%)`,
      `hsl(${Math.floor(Math.random() * 360)}, 80%, 60%)`,
      `hsl(${Math.floor(Math.random() * 360)}, 80%, 60%)`
    ],
    vertices: getVertices()
  };
}

// Divine proportion amplification
export function divineProportionAmplify(intention: string, multiplier: number = 1.0) {
  const baseStrength = 0.5 + Math.random() * 0.3;
  const amplifiedStrength = baseStrength * PHI * multiplier;
  
  return {
    original_intention: intention,
    amplified_intention: `I am in divine harmony with ${intention}`,
    original_strength: baseStrength,
    amplified_strength: Math.min(amplifiedStrength, 1.0),
    phi_factor: PHI,
    multiplier: multiplier,
    divine_signature: generateQuantumSignature()
  };
}

// Generate based on field type
export function generateSacredGeometryField(
  intention: string, 
  fieldType: FieldType,
  options: { 
    frequency?: number; 
    boost?: boolean; 
    duration?: number;
    solidType?: "tetrahedron" | "hexahedron" | "octahedron" | "dodecahedron" | "icosahedron";
  } = {}
): SacredGeometryField {
  switch (fieldType) {
    case "torus":
      return { 
        type: "torus", 
        data: generateTorusField(intention, options.frequency || SCHUMANN_RESONANCE) 
      };
    case "merkaba":
      return { 
        type: "merkaba", 
        data: generateMerkabaField(intention, options.frequency || SCHUMANN_RESONANCE) 
      };
    case "metatron":
      return { 
        type: "metatron", 
        data: generateMetatronField(intention, options.boost || false) 
      };
    case "sri_yantra":
      return { 
        type: "sri_yantra", 
        data: generateSriYantraField(intention) 
      };
    case "flower_of_life":
      return { 
        type: "flower_of_life", 
        data: generateFlowerOfLifeField(intention, options.duration || 60) 
      };
    case "platonic_solid":
      return { 
        type: "platonic_solid", 
        data: generatePlatonicSolidField(intention, options.solidType || "dodecahedron") 
      };
    default:
      return { 
        type: "torus", 
        data: generateTorusField(intention) 
      };
  }
}