// Sacred constants

// The Golden Ratio (phi)
export const PHI = 1.618033988749895;

// Schumann Resonance (Earth's natural frequency)
export const SCHUMANN_RESONANCE = 7.83;

// Solfeggio Frequencies
export const SOLFEGGIO = {
  UT: 396, // Liberating guilt and fear
  RE: 417, // Undoing situations and facilitating change
  MI: 528, // Transformation and miracles (DNA repair)
  FA: 639, // Connecting/relationships
  SOL: 741, // Awakening intuition
  LA: 852, // Returning to spiritual order
};

// Platonic Solids and their elements
export const PLATONIC_SOLIDS = {
  TETRAHEDRON: { name: "Tetrahedron", element: "Fire", faces: 4 },
  HEXAHEDRON: { name: "Hexahedron (Cube)", element: "Earth", faces: 6 },
  OCTAHEDRON: { name: "Octahedron", element: "Air", faces: 8 },
  DODECAHEDRON: { name: "Dodecahedron", element: "Ether", faces: 12 },
  ICOSAHEDRON: { name: "Icosahedron", element: "Water", faces: 20 },
};

// Healing categories
export const HEALING_CATEGORIES = [
  "PHYSICAL",
  "EMOTIONAL",
  "SPIRITUAL",
  "MENTAL",
  "FINANCIAL",
  "RELATIONSHIPS",
  "CHAKRA",
  "CENTRAL NERVOUS SYSTEM",
  "PSYCHOLOGICAL",
  "SELF-HELP",
];

// Field types for sacred geometry
export const FIELD_TYPES = [
  { value: "torus", label: "Torus Field", description: "Creating and manifestation" },
  { value: "merkaba", label: "Merkaba", description: "Protection and ascension" },
  { value: "metatron", label: "Metatron's Cube", description: "Transformation and balance" },
  { value: "sri_yantra", label: "Sri Yantra", description: "Connection and higher consciousness" },
  { value: "flower_of_life", label: "Flower of Life", description: "Healing and harmony" },
  { value: "platonic_solid", label: "Platonic Solids", description: "Elemental balance" },
];

// Chakra information
export const CHAKRAS = [
  { 
    name: "Root", 
    sanskrit: "Muladhara", 
    color: "#FF0000", 
    frequency: 396, 
    location: "Base of spine", 
    element: "Earth",
    mantra: "LAM",
    associations: ["survival", "grounding", "security", "stability"]
  },
  { 
    name: "Sacral", 
    sanskrit: "Svadhisthana", 
    color: "#FFA500", 
    frequency: 417, 
    location: "Lower abdomen", 
    element: "Water",
    mantra: "VAM",
    associations: ["creativity", "sexuality", "emotions", "pleasure"]
  },
  { 
    name: "Solar Plexus", 
    sanskrit: "Manipura", 
    color: "#FFFF00", 
    frequency: 528, 
    location: "Upper abdomen", 
    element: "Fire",
    mantra: "RAM",
    associations: ["confidence", "personal power", "self-esteem"]
  },
  { 
    name: "Heart", 
    sanskrit: "Anahata", 
    color: "#00FF00", 
    frequency: 639, 
    location: "Center of chest", 
    element: "Air",
    mantra: "YAM",
    associations: ["love", "compassion", "healing", "harmony"]
  },
  { 
    name: "Throat", 
    sanskrit: "Vishuddha", 
    color: "#00FFFF", 
    frequency: 741, 
    location: "Throat", 
    element: "Ether/Space",
    mantra: "HAM",
    associations: ["communication", "truth", "expression", "clarity"]
  },
  { 
    name: "Third Eye", 
    sanskrit: "Ajna", 
    color: "#0000FF", 
    frequency: 852, 
    location: "Forehead", 
    element: "Light",
    mantra: "OM",
    associations: ["intuition", "perception", "imagination", "insight"]
  },
  { 
    name: "Crown", 
    sanskrit: "Sahasrara", 
    color: "#800080", 
    frequency: 963, 
    location: "Top of head", 
    element: "Cosmic Energy",
    mantra: "Silence",
    associations: ["enlightenment", "cosmic connection", "spirituality"]
  }
];