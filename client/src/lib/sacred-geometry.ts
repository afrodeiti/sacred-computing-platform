// Helper functions for sacred geometry calculations and visualizations

// Golden Ratio (Phi)
export const PHI = (1 + Math.sqrt(5)) / 2; // 1.618...

// Sacred Number Sequences
export const FIBONACCI = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987];
export const METATRON = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48]; // Tesla's "3-6-9" sequence
export const SOLFEGGIO = [396, 417, 528, 639, 741, 852, 963]; // Solfeggio frequencies

// Generate points for a torus
export function generateTorusPoints(
  R: number = 100, // Large radius
  r: number = 30,  // Small radius
  segments: number = 32, // Number of segments
  rotation: number = 0  // Rotation in radians
): { x: number; y: number; z: number }[] {
  const points: { x: number; y: number; z: number }[] = [];

  for (let i = 0; i < segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    for (let j = 0; j < segments; j++) {
      const phi = (j / segments) * Math.PI * 2;
      
      const x = (R + r * Math.cos(theta)) * Math.cos(phi + rotation);
      const y = (R + r * Math.cos(theta)) * Math.sin(phi + rotation);
      const z = r * Math.sin(theta);
      
      points.push({ x, y, z });
    }
  }

  return points;
}

// Generate Merkaba (Star Tetrahedron) vertices
export function generateMerkabaVertices(size: number = 100): {
  upTetrahedron: { x: number; y: number; z: number }[];
  downTetrahedron: { x: number; y: number; z: number }[];
} {
  // Tetrahedron pointing up (masculine energy)
  const upTetrahedron = [
    { x: 0, y: 0, z: size },              // Top
    { x: -size, y: -size, z: -size/3 },   // Bottom left
    { x: size, y: -size, z: -size/3 },    // Bottom right
    { x: 0, y: size, z: -size/3 }         // Bottom back
  ];
  
  // Tetrahedron pointing down (feminine energy)
  const downTetrahedron = [
    { x: 0, y: 0, z: -size },             // Bottom
    { x: -size, y: -size, z: size/3 },    // Top left
    { x: size, y: -size, z: size/3 },     // Top right
    { x: 0, y: size, z: size/3 }          // Top back
  ];
  
  return { upTetrahedron, downTetrahedron };
}

// Generate Flower of Life pattern
export function generateFlowerOfLifePoints(
  centerX: number = 0,
  centerY: number = 0,
  radius: number = 30,
  layers: number = 3
): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  const centers: { x: number; y: number }[] = [{ x: centerX, y: centerY }];
  
  // Add the center point
  points.push({ x: centerX, y: centerY });
  
  // Generate each layer
  for (let layer = 1; layer <= layers; layer++) {
    const newCenters: { x: number; y: number }[] = [];
    
    // For each existing center, create 6 circles around it
    for (const center of centers) {
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const x = center.x + Math.cos(angle) * (radius * 2);
        const y = center.y + Math.sin(angle) * (radius * 2);
        
        // Check if this center already exists
        const exists = newCenters.some(c => 
          Math.abs(c.x - x) < 0.001 && Math.abs(c.y - y) < 0.001
        );
        
        if (!exists) {
          newCenters.push({ x, y });
          points.push({ x, y });
        }
      }
    }
    
    centers.push(...newCenters);
  }
  
  return points;
}

// Generate Sri Yantra geometry
export function generateSriYantraGeometry(size: number = 100): {
  triangles: { points: { x: number; y: number }[] }[];
  bindu: { x: number; y: number };
} {
  const bindu = { x: 0, y: 0 }; // Central point
  const triangles = [];
  
  // Generate the 9 interlocking triangles
  for (let i = 0; i < 9; i++) {
    const isShiva = i % 2 === 0; // Shiva (downward) triangles are even-indexed
    const scale = 0.5 + (i * 0.05);
    
    if (isShiva) {
      // Downward-pointing triangle (Shiva)
      triangles.push({
        points: [
          { x: 0, y: -size * scale },
          { x: size * scale, y: size * scale * 0.8 },
          { x: -size * scale, y: size * scale * 0.8 }
        ]
      });
    } else {
      // Upward-pointing triangle (Shakti)
      triangles.push({
        points: [
          { x: 0, y: size * scale },
          { x: size * scale, y: -size * scale * 0.8 },
          { x: -size * scale, y: -size * scale * 0.8 }
        ]
      });
    }
  }
  
  return { triangles, bindu };
}

// Generate Metatron's Cube
export function generateMetatronsCube(size: number = 100): {
  spheres: { x: number; y: number }[];
  connections: { from: number; to: number }[];
} {
  // 13 spheres positions
  const spheres = [
    { x: 0, y: 0 }, // Center
    
    // First ring of 6
    { x: size, y: 0 },
    { x: size * 0.5, y: size * 0.866 },
    { x: -size * 0.5, y: size * 0.866 },
    { x: -size, y: 0 },
    { x: -size * 0.5, y: -size * 0.866 },
    { x: size * 0.5, y: -size * 0.866 },
    
    // Second ring of 6
    { x: size * 2, y: 0 },
    { x: size, y: size * 1.732 },
    { x: -size, y: size * 1.732 },
    { x: -size * 2, y: 0 },
    { x: -size, y: -size * 1.732 },
    { x: size, y: -size * 1.732 }
  ];
  
  // Connections between spheres (showing the first 30 connections for clarity)
  const connections = [
    // Connect center to first ring
    { from: 0, to: 1 },
    { from: 0, to: 2 },
    { from: 0, to: 3 },
    { from: 0, to: 4 },
    { from: 0, to: 5 },
    { from: 0, to: 6 },
    
    // Connect first ring
    { from: 1, to: 2 },
    { from: 2, to: 3 },
    { from: 3, to: 4 },
    { from: 4, to: 5 },
    { from: 5, to: 6 },
    { from: 6, to: 1 },
    
    // Connect first ring to second ring
    { from: 1, to: 7 },
    { from: 2, to: 8 },
    { from: 3, to: 9 },
    { from: 4, to: 10 },
    { from: 5, to: 11 },
    { from: 6, to: 12 },
    
    // Connect second ring (partial)
    { from: 7, to: 8 },
    { from: 8, to: 9 },
    { from: 9, to: 10 },
    { from: 10, to: 11 },
    { from: 11, to: 12 },
    { from: 12, to: 7 },
    
    // Some cross-connections for the platonic solids
    { from: 1, to: 3 },
    { from: 3, to: 5 },
    { from: 5, to: 1 },
    { from: 2, to: 4 },
    { from: 4, to: 6 },
    { from: 6, to: 2 }
  ];
  
  return { spheres, connections };
}
