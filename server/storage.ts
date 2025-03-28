import { 
  users, type User, type InsertUser,
  soulArchive, type SoulArchive, type InsertSoulArchive,
  healingCode, type HealingCode, type InsertHealingCode,
  energeticSignature, type EnergeticSignature, type InsertEnergeticSignature,
  energeticPattern, type EnergeticPattern, type InsertEnergeticPattern,
  cropCircleFormation, type CropCircleFormation, type InsertCropCircleFormation,
  spiritCommunication, type SpiritCommunication, type InsertSpiritCommunication,
  chakra, type Chakra, type InsertChakra,
  chakraHealingSession, type ChakraHealingSession, type InsertChakraHealingSession
} from "@shared/schema";
import { sql } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Soul Archive methods
  getSoulArchives(): Promise<SoulArchive[]>;
  getSoulArchiveById(id: number): Promise<SoulArchive | undefined>;
  createSoulArchive(archive: InsertSoulArchive): Promise<SoulArchive>;
  deleteSoulArchive(id: number): Promise<boolean>;
  
  // Healing Code methods
  getHealingCodes(): Promise<HealingCode[]>;
  getHealingCodesByCategory(category: string): Promise<HealingCode[]>;
  searchHealingCodes(query: string): Promise<HealingCode[]>;
  createHealingCode(code: InsertHealingCode): Promise<HealingCode>;
  
  // Energetic Signature methods
  getEnergeticSignatures(): Promise<EnergeticSignature[]>;
  getEnergeticSignatureById(id: number): Promise<EnergeticSignature | undefined>;
  getEnergeticSignaturesByCategory(category: string): Promise<EnergeticSignature[]>;
  searchEnergeticSignatures(query: string): Promise<EnergeticSignature[]>;
  createEnergeticSignature(signature: InsertEnergeticSignature): Promise<EnergeticSignature>;
  
  // Energetic Pattern methods
  getEnergeticPatterns(): Promise<EnergeticPattern[]>;
  getEnergeticPatternById(id: number): Promise<EnergeticPattern | undefined>;
  getUserEnergeticPatterns(userId: number): Promise<EnergeticPattern[]>;
  createEnergeticPattern(pattern: InsertEnergeticPattern): Promise<EnergeticPattern>;
  deleteEnergeticPattern(id: number): Promise<boolean>;
  
  // Crop Circle Formation methods
  getCropCircleFormations(): Promise<CropCircleFormation[]>;
  getCropCircleFormationById(id: number): Promise<CropCircleFormation | undefined>;
  createCropCircleFormation(formation: InsertCropCircleFormation): Promise<CropCircleFormation>;
  
  // Spirit Communication methods
  getSpiritCommunications(): Promise<SpiritCommunication[]>;
  getSpiritCommunicationById(id: number): Promise<SpiritCommunication | undefined>;
  getUserSpiritCommunications(userId: number): Promise<SpiritCommunication[]>;
  createSpiritCommunication(communication: InsertSpiritCommunication): Promise<SpiritCommunication>;
  
  // Chakra methods
  getChakras(): Promise<Chakra[]>;
  getChakraById(id: number): Promise<Chakra | undefined>;
  getChakraByNumber(number: number): Promise<Chakra | undefined>;
  createChakra(chakra: InsertChakra): Promise<Chakra>;
  
  // Chakra Healing Session methods
  getChakraHealingSessions(): Promise<ChakraHealingSession[]>;
  getChakraHealingSessionById(id: number): Promise<ChakraHealingSession | undefined>;
  getUserChakraHealingSessions(userId: number): Promise<ChakraHealingSession[]>;
  createChakraHealingSession(session: InsertChakraHealingSession): Promise<ChakraHealingSession>;
  updateChakraHealingSessionStatus(id: number, status: string): Promise<ChakraHealingSession | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private soulArchives: Map<number, SoulArchive>;
  private healingCodes: Map<number, HealingCode>;
  private energeticSignatures: Map<number, EnergeticSignature>;
  private energeticPatterns: Map<number, EnergeticPattern>;
  private cropCircleFormations: Map<number, CropCircleFormation>;
  private spiritCommunications: Map<number, SpiritCommunication>;
  private chakras: Map<number, Chakra>;
  private chakraHealingSessions: Map<number, ChakraHealingSession>;
  
  currentUserId: number;
  currentArchiveId: number;
  currentCodeId: number;
  currentSignatureId: number;
  currentPatternId: number;
  currentFormationId: number;
  currentCommunicationId: number;
  currentChakraId: number;
  currentChakraHealingSessionId: number;

  constructor() {
    this.users = new Map();
    this.soulArchives = new Map();
    this.healingCodes = new Map();
    this.energeticSignatures = new Map();
    this.energeticPatterns = new Map();
    this.cropCircleFormations = new Map();
    this.spiritCommunications = new Map();
    this.chakras = new Map();
    this.chakraHealingSessions = new Map();
    
    this.currentUserId = 1;
    this.currentArchiveId = 1;
    this.currentCodeId = 1;
    this.currentSignatureId = 1;
    this.currentPatternId = 1;
    this.currentFormationId = 1;
    this.currentCommunicationId = 1;
    this.currentChakraId = 1;
    this.currentChakraHealingSessionId = 1;
    
    // Initialize with sample data
    this.initializeHealingCodes();
    this.initializeEnergeticSignatures();
    this.initializeCropCircleFormations();
    this.initializeChakras();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Soul Archive methods
  async getSoulArchives(): Promise<SoulArchive[]> {
    return Array.from(this.soulArchives.values()).sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }
  
  async getSoulArchiveById(id: number): Promise<SoulArchive | undefined> {
    return this.soulArchives.get(id);
  }
  
  async createSoulArchive(archive: InsertSoulArchive): Promise<SoulArchive> {
    const id = this.currentArchiveId++;
    const now = new Date();
    
    // Ensure all required properties have values, even if null
    const soulArchive: SoulArchive = {
      id,
      title: archive.title,
      description: archive.description ?? null,
      intention: archive.intention ?? null,
      frequency: archive.frequency,
      boost: archive.boost ?? null,
      multiplier: archive.multiplier ?? null,
      pattern_type: archive.pattern_type,
      pattern_data: archive.pattern_data,
      created_at: now
    };
    
    this.soulArchives.set(id, soulArchive);
    return soulArchive;
  }
  
  async deleteSoulArchive(id: number): Promise<boolean> {
    return this.soulArchives.delete(id);
  }
  
  // Healing Code methods
  async getHealingCodes(): Promise<HealingCode[]> {
    return Array.from(this.healingCodes.values());
  }
  
  async getHealingCodesByCategory(category: string): Promise<HealingCode[]> {
    return Array.from(this.healingCodes.values())
      .filter(code => code.category === category);
  }
  
  async searchHealingCodes(query: string): Promise<HealingCode[]> {
    if (!query) return this.getHealingCodes();
    
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.healingCodes.values())
      .filter(code => 
        code.code.toLowerCase().includes(lowercaseQuery) || 
        code.description.toLowerCase().includes(lowercaseQuery) ||
        (code.category && code.category.toLowerCase().includes(lowercaseQuery))
      );
  }
  
  async createHealingCode(code: InsertHealingCode): Promise<HealingCode> {
    const id = this.currentCodeId++;
    
    // Ensure all required properties have values, even if null
    const healingCode: HealingCode = { 
      id,
      code: code.code,
      description: code.description,
      category: code.category ?? null,
      codeType: code.codeType ?? "grabovoi" // Default to Grabovoi if not specified
    };
    
    this.healingCodes.set(id, healingCode);
    return healingCode;
  }
  
  // Energetic Signature methods
  async getEnergeticSignatures(): Promise<EnergeticSignature[]> {
    return Array.from(this.energeticSignatures.values());
  }
  
  async getEnergeticSignatureById(id: number): Promise<EnergeticSignature | undefined> {
    return this.energeticSignatures.get(id);
  }
  
  async getEnergeticSignaturesByCategory(category: string): Promise<EnergeticSignature[]> {
    return Array.from(this.energeticSignatures.values())
      .filter(signature => signature.category === category);
  }
  
  async searchEnergeticSignatures(query: string): Promise<EnergeticSignature[]> {
    if (!query) return this.getEnergeticSignatures();
    
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.energeticSignatures.values())
      .filter(signature => 
        signature.name.toLowerCase().includes(lowercaseQuery) || 
        (signature.description && signature.description.toLowerCase().includes(lowercaseQuery)) ||
        signature.category.toLowerCase().includes(lowercaseQuery)
      );
  }
  
  async createEnergeticSignature(signature: InsertEnergeticSignature): Promise<EnergeticSignature> {
    const id = this.currentSignatureId++;
    const now = new Date();
    
    // Ensure all required properties have values, even if null
    const energeticSignature: EnergeticSignature = {
      id,
      name: signature.name,
      category: signature.category,
      description: signature.description ?? null,
      baseFrequency: signature.baseFrequency ?? null,
      harmonics: signature.harmonics ?? null,
      waveform: signature.waveform ?? null,
      mathematicalFormula: signature.mathematicalFormula ?? null,
      geometryType: signature.geometryType ?? null,
      colorSpectrum: signature.colorSpectrum ?? null,
      numericalSequence: signature.numericalSequence ?? null,
      visualPattern: signature.visualPattern ?? null,
      created_at: now
    };
    
    this.energeticSignatures.set(id, energeticSignature);
    return energeticSignature;
  }
  
  // Energetic Pattern methods
  async getEnergeticPatterns(): Promise<EnergeticPattern[]> {
    return Array.from(this.energeticPatterns.values()).sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }
  
  async getEnergeticPatternById(id: number): Promise<EnergeticPattern | undefined> {
    return this.energeticPatterns.get(id);
  }
  
  async getUserEnergeticPatterns(userId: number): Promise<EnergeticPattern[]> {
    return Array.from(this.energeticPatterns.values())
      .filter(pattern => pattern.userId === userId)
      .sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  }
  
  async createEnergeticPattern(pattern: InsertEnergeticPattern): Promise<EnergeticPattern> {
    const id = this.currentPatternId++;
    const now = new Date();
    
    // Ensure all required properties have values, even if null
    const energeticPattern: EnergeticPattern = {
      id,
      title: pattern.title,
      description: pattern.description ?? null,
      intention: pattern.intention ?? null,
      userId: pattern.userId ?? null,
      signatures: pattern.signatures ?? null,
      visualSettings: pattern.visualSettings ?? null,
      audioSettings: pattern.audioSettings ?? null,
      created_at: now
    };
    
    this.energeticPatterns.set(id, energeticPattern);
    return energeticPattern;
  }
  
  async deleteEnergeticPattern(id: number): Promise<boolean> {
    return this.energeticPatterns.delete(id);
  }
  
  // Crop Circle Formation methods
  async getCropCircleFormations(): Promise<CropCircleFormation[]> {
    return Array.from(this.cropCircleFormations.values());
  }
  
  async getCropCircleFormationById(id: number): Promise<CropCircleFormation | undefined> {
    return this.cropCircleFormations.get(id);
  }
  
  async createCropCircleFormation(formation: InsertCropCircleFormation): Promise<CropCircleFormation> {
    const id = this.currentFormationId++;
    const now = new Date();
    
    // Ensure all required properties have values, even if null
    const cropCircleFormation: CropCircleFormation = {
      id,
      name: formation.name,
      location: formation.location ?? null,
      yearDiscovered: formation.yearDiscovered ?? null,
      description: formation.description ?? null,
      mathematicalPattern: formation.mathematicalPattern,
      energeticProperties: formation.energeticProperties ?? null,
      created_at: now
    };
    
    this.cropCircleFormations.set(id, cropCircleFormation);
    return cropCircleFormation;
  }
  
  // Spirit Communication methods
  async getSpiritCommunications(): Promise<SpiritCommunication[]> {
    return Array.from(this.spiritCommunications.values()).sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }
  
  async getSpiritCommunicationById(id: number): Promise<SpiritCommunication | undefined> {
    return this.spiritCommunications.get(id);
  }
  
  async getUserSpiritCommunications(userId: number): Promise<SpiritCommunication[]> {
    return Array.from(this.spiritCommunications.values())
      .filter(comm => comm.userId === userId)
      .sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
  }
  
  async createSpiritCommunication(communication: InsertSpiritCommunication): Promise<SpiritCommunication> {
    const id = this.currentCommunicationId++;
    const now = new Date();
    
    // Ensure all required properties have values, even if null
    const spiritCommunication: SpiritCommunication = {
      id,
      intention: communication.intention,
      activationCodes: communication.activationCodes,
      portalType: communication.portalType,
      portalFrequency: communication.portalFrequency ?? null,
      response: communication.response,
      energeticSignature: communication.energeticSignature ?? null,
      portalGeometry: communication.portalGeometry ?? null,
      timestamp: now,
      userId: communication.userId ?? null
    };
    
    this.spiritCommunications.set(id, spiritCommunication);
    return spiritCommunication;
  }

  // Initialize with sample data
  private initializeHealingCodes() {
    // Sample Grabovoi codes
    const grabovoiCodes = [
      { code: "23 74 555", description: "Healing headaches in general", category: "CENTRAL NERVOUS SYSTEM", codeType: "grabovoi" },
      { code: "58 33 554", description: "Healing migraine", category: "CENTRAL NERVOUS SYSTEM", codeType: "grabovoi" },
      { code: "71 81 533", description: "Back pain relief", category: "CENTRAL NERVOUS SYSTEM", codeType: "grabovoi" },
      { code: "33 45 10101", description: "Forgiveness", category: "PSYCHOLOGICAL CONCERNS", codeType: "grabovoi" },
      { code: "11 96 888", description: "Low self-esteem to healthy self-image", category: "SELF-HELP", codeType: "grabovoi" },
      { code: "8888", description: "Divine protection", category: "SPIRITUAL", codeType: "grabovoi" },
      { code: "13 13 514", description: "Stress relief/relaxation", category: "SELF-HELP", codeType: "grabovoi" },
      { code: "517 489719 841", description: "Increase self-confidence", category: "SELF-HELP", codeType: "grabovoi" },
      { code: "56 57 893", description: "Unconditional love", category: "RELATIONSHIPS", codeType: "grabovoi" },
      { code: "888 412 1289018", description: "Love (general & relationships)", category: "RELATIONSHIPS", codeType: "grabovoi" }
    ];
    
    // Sample Divine healing codes
    const divineHealingCodes = [
      { code: "963", description: "Connection with Higher Self", category: "SPIRITUAL", codeType: "divine" },
      { code: "528", description: "DNA Repair and Transformation", category: "HEALING", codeType: "divine" },
      { code: "432", description: "Universal Harmony and Resonance", category: "HARMONY", codeType: "divine" },
      { code: "639", description: "Heart Chakra Balance", category: "CHAKRAS", codeType: "divine" },
      { code: "417", description: "Facilitating Change and Transition", category: "TRANSFORMATION", codeType: "divine" },
      { code: "852", description: "Third Eye Awakening", category: "SPIRITUAL", codeType: "divine" },
      { code: "369", description: "Tesla's Key to the Universe", category: "UNIVERSAL LAWS", codeType: "divine" },
      { code: "174", description: "Natural Analgesia and Pain Relief", category: "PAIN RELIEF", codeType: "divine" },
      { code: "741", description: "Cleansing and Detoxification", category: "PURIFICATION", codeType: "divine" },
      { code: "396", description: "Liberation from Fear and Guilt", category: "EMOTIONAL RELEASE", codeType: "divine" }
    ];
    
    // Add all codes to the storage
    grabovoiCodes.forEach(code => {
      this.createHealingCode(code);
    });
    
    divineHealingCodes.forEach(code => {
      this.createHealingCode(code);
    });
  }
  
  private initializeEnergeticSignatures() {
    // Sample energetic signatures with mathematical patterns
    const sampleSignatures = [
      {
        name: "Love Frequency",
        category: "emotion",
        description: "The energetic signature of unconditional love",
        baseFrequency: 528,
        harmonics: [1056, 1584, 2112],
        waveform: "sine",
        mathematicalFormula: "f(t) = A * sin(2π * 528 * t)",
        geometryType: "torus",
        colorSpectrum: "#E35CAF",
        numericalSequence: "528",
        visualPattern: {
          type: "torus",
          radius: 1,
          tubeRadius: 0.4,
          radialSegments: 16,
          tubularSegments: 100,
          arc: 2 * Math.PI
        }
      },
      {
        name: "Earth Grounding",
        category: "element",
        description: "The stabilizing frequency of earth element",
        baseFrequency: 7.83,
        harmonics: [15.66, 23.49, 31.32],
        waveform: "triangle",
        mathematicalFormula: "f(t) = A * triangle(2π * 7.83 * t)",
        geometryType: "platonic_solid",
        colorSpectrum: "#4D7B2C",
        numericalSequence: "147",
        visualPattern: {
          type: "platonic",
          solid: "hexahedron",
          radius: 1,
          detail: 0
        }
      },
      {
        name: "Third Eye Activation",
        category: "bodySystem",
        description: "Frequency pattern for third eye chakra activation",
        baseFrequency: 852,
        harmonics: [1704, 2556],
        waveform: "sine",
        mathematicalFormula: "f(t) = A * sin(2π * 852 * t)",
        geometryType: "sri_yantra",
        colorSpectrum: "#9370DB",
        numericalSequence: "369",
        visualPattern: {
          type: "sriYantra",
          scale: 1,
          detail: 9
        }
      }
    ];
    
    sampleSignatures.forEach(signature => {
      this.createEnergeticSignature(signature);
    });
  }
  
  // Chakra methods
  async getChakras(): Promise<Chakra[]> {
    return Array.from(this.chakras.values()).sort((a, b) => a.number - b.number);
  }
  
  async getChakraById(id: number): Promise<Chakra | undefined> {
    return this.chakras.get(id);
  }
  
  async getChakraByNumber(number: number): Promise<Chakra | undefined> {
    return Array.from(this.chakras.values()).find(c => c.number === number);
  }
  
  async createChakra(chakraData: InsertChakra): Promise<Chakra> {
    const id = this.currentChakraId++;
    
    const chakra: Chakra = {
      id,
      name: chakraData.name,
      sanskritName: chakraData.sanskritName ?? null,
      number: chakraData.number,
      color: chakraData.color,
      location: chakraData.location,
      description: chakraData.description,
      healingCode: chakraData.healingCode,
      keywords: chakraData.keywords ?? null,
      elementalAssociation: chakraData.elementalAssociation ?? null,
      soundAssociation: chakraData.soundAssociation ?? null,
      qrCodePath: chakraData.qrCodePath
    };
    
    this.chakras.set(id, chakra);
    return chakra;
  }
  
  // Chakra Healing Session methods
  async getChakraHealingSessions(): Promise<ChakraHealingSession[]> {
    return Array.from(this.chakraHealingSessions.values()).sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }
  
  async getChakraHealingSessionById(id: number): Promise<ChakraHealingSession | undefined> {
    return this.chakraHealingSessions.get(id);
  }
  
  async getUserChakraHealingSessions(userId: number): Promise<ChakraHealingSession[]> {
    return Array.from(this.chakraHealingSessions.values())
      .filter(session => session.userId === userId)
      .sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
  }
  
  async createChakraHealingSession(session: InsertChakraHealingSession): Promise<ChakraHealingSession> {
    const id = this.currentChakraHealingSessionId++;
    const now = new Date();
    
    const chakraHealingSession: ChakraHealingSession = {
      id,
      chakraId: session.chakraId,
      userId: session.userId ?? null,
      intention: session.intention,
      duration: session.duration,
      intensity: session.intensity ?? 5,
      repetitions: session.repetitions ?? 108,
      useFrequency: session.useFrequency ?? true,
      frequency: session.frequency ?? null,
      timestamp: now,
      notes: session.notes ?? null,
      status: session.status ?? "completed"
    };
    
    this.chakraHealingSessions.set(id, chakraHealingSession);
    return chakraHealingSession;
  }
  
  async updateChakraHealingSessionStatus(id: number, status: string): Promise<ChakraHealingSession | undefined> {
    const session = await this.getChakraHealingSessionById(id);
    if (!session) return undefined;
    
    const updatedSession = { ...session, status };
    this.chakraHealingSessions.set(id, updatedSession);
    return updatedSession;
  }
  
  // Initialization methods
  private initializeChakras() {
    // Initialize the 12 chakras from the QR code assets
    const chakraData = [
      {
        name: "Root Chakra",
        sanskritName: "Muladhara",
        number: 1,
        color: "#fd4016", // Red
        location: "Base of spine",
        description: "Grounding and stability. Governs survival instincts, security, and basic needs.",
        healingCode: "2900855F872CC24FAA5F6BEEF80CCB32064C050497E8AD8EB7079E66690BF0049F0DB4E3D10CAE597A001B3E23466F46DE60C05C757BD72087F270916707D64E",
        keywords: ["security", "survival", "grounding", "stability", "basic needs"],
        elementalAssociation: "Earth",
        soundAssociation: "LAM",
        qrCodePath: "@assets/1. Root Chakra.png"
      },
      {
        name: "Sacral Chakra",
        sanskritName: "Svadhishthana",
        number: 2,
        color: "#ff992f", // Orange
        location: "Lower abdomen, about 2 inches below navel",
        description: "Stimulates pleasure and creativity. Governs emotional well-being, sexuality, and creative expression.",
        healingCode: "79E026C6F58E6C55A959892829276E0D1105157118C6F843912BBF8F0E372C951C15F02DB37999EA784EFC1F0C22F24D3E034F1DBE26B3FE1E4DFF1D102B0356",
        keywords: ["creativity", "sexuality", "pleasure", "emotions", "relationships"],
        elementalAssociation: "Water",
        soundAssociation: "VAM",
        qrCodePath: "@assets/2. Sacral Chakra.png"
      },
      {
        name: "Solar Plexus Chakra",
        sanskritName: "Manipura",
        number: 3,
        color: "#fff150", // Yellow
        location: "Upper abdomen, stomach area",
        description: "Promotes confidence and energy. Governs personal power, will, and assertiveness.",
        healingCode: "510B68A89DD1A837EAA3F87E72A44A6D3006C23B23DC48938DA8C4925711C3368E50DB172081F9C542A68FE31E4CF17890DA961BD4469AFFCCDBFBEB38C4F0C7",
        keywords: ["personal power", "self-esteem", "confidence", "energy", "will"],
        elementalAssociation: "Fire",
        soundAssociation: "RAM",
        qrCodePath: "@assets/3. Solar Plexus Chakra.png"
      },
      {
        name: "Heart Chakra",
        sanskritName: "Anahata",
        number: 4,
        color: "#77cc95", // Green
        location: "Center of chest, heart area",
        description: "Fosters healing and compassion. Governs love, compassion, and balance between physical and spiritual realms.",
        healingCode: "B43D197B2F113EAAF360568C35D7646BFE845590D5FC6CCEB6241DCF69020CC04768E0493FCF63187EF69C9F1F00B6C26F076299786C267A4EEE8513C5F75B1E",
        keywords: ["love", "compassion", "forgiveness", "healing", "balance"],
        elementalAssociation: "Air",
        soundAssociation: "YAM",
        qrCodePath: "@assets/4. Heart Chakra.png"
      },
      {
        name: "Throat Chakra",
        sanskritName: "Vishuddha",
        number: 5,
        color: "#37a6f5", // Blue
        location: "Throat area",
        description: "Enhances clarity and truth. Governs communication, self-expression, and speaking truth.",
        healingCode: "117B00D87E4A57A3EC99BCD9DC69266C17B06EC2AE30CCA476126D9F7AC294E7A406C04C12041250E3221C8160CAC32C91019688E07A5308739EA07DA585D9C3",
        keywords: ["communication", "truth", "expression", "clarity", "voice"],
        elementalAssociation: "Ether",
        soundAssociation: "HAM",
        qrCodePath: "@assets/5. Throat Chakra.png"
      },
      {
        name: "Third Eye Chakra",
        sanskritName: "Ajna",
        number: 6,
        color: "#614ea8", // Indigo
        location: "Forehead, between the eyes",
        description: "Aids in spiritual awareness and perception. Governs intuition, insight, and access to deeper wisdom.",
        healingCode: "470B22B7368067FE471EF3651E6CAE1E910897FD41D1EDE7D270A0203F8FB8651DD05153E0AED620FB1F45EBBCB1586C2DA679118DE06FED5D345971832918F5",
        keywords: ["intuition", "insight", "perception", "awareness", "wisdom"],
        elementalAssociation: "Light",
        soundAssociation: "OM",
        qrCodePath: "@assets/6. Third Eye Chakra.png"
      },
      {
        name: "Crown Chakra",
        sanskritName: "Sahasrara",
        number: 7,
        color: "#cc81bc", // Violet
        location: "Top of the head",
        description: "Promotes higher consciousness and unity. Governs spiritual connection, divine wisdom, and universal consciousness.",
        healingCode: "80B5F5483D921BF8BC261C939A645CF94BB036A2164F9351FC25AFDA50A66DAE1A53FDEA6080070A5B89861FAE8147CEF9D9A6B8B6DDE28C81F70A49AFC0DA61",
        keywords: ["spirituality", "divine connection", "enlightenment", "consciousness", "unity"],
        elementalAssociation: "Thought",
        soundAssociation: "Silence",
        qrCodePath: "@assets/7. Crown Chakra.png"
      },
      {
        name: "Earth Star Chakra",
        sanskritName: null,
        number: 8,
        color: "#8B4513", // Brown
        location: "Below feet, into the Earth",
        description: "Grounding and connection to the Earth. Anchors higher dimensional energies into physical reality.",
        healingCode: "6D234FFA6EAEE55BBF86D869CB4E5C3A727382CEDE08A285964D7B5D7F5F11EAF320DD4F15909E35310688AF97717987F09699B2F898BBE5D7C3278C2DB8887B",
        keywords: ["grounding", "anchoring", "stability", "earth connection", "physical reality"],
        elementalAssociation: "Earth core",
        soundAssociation: "HA",
        qrCodePath: "@assets/8. Earth Star Chakra.png"
      },
      {
        name: "Soul Star Chakra",
        sanskritName: null,
        number: 9,
        color: "#FFFFFF", // White
        location: "Above the crown",
        description: "Represents spiritual enlightenment and connection to the higher self. Gateway to higher dimensions.",
        healingCode: "B068BE04CFB0F8AF7DA78962EC57872E54949ADD6C73D9A45D8CEC7BD6D91CE85D6E4280C6C9F6A2F1BCE6A5913AF57F73F4D2B1F61D4C467C029EF6914D9FB4",
        keywords: ["higher self", "enlightenment", "ascension", "spiritual growth", "soul purpose"],
        elementalAssociation: "Cosmic energy",
        soundAssociation: "MA",
        qrCodePath: "@assets/9. Soul Star Chakra.png"
      },
      {
        name: "Higher Heart Chakra",
        sanskritName: null,
        number: 10,
        color: "#FF69B4", // Pink
        location: "Between heart and throat chakras",
        description: "Symbolizes unconditional love and compassion. Bridge between emotional and communicative aspects of being.",
        healingCode: "8BDCE0D4C18FD09263EBBD61ED67B4A67714A0C17676E80D6936D08744C486DDB15309AE343A875A055A5B3DA343DFE1939DF52ED7058F4EA164A205E66E77C0",
        keywords: ["unconditional love", "compassion", "higher heart", "divine love", "selflessness"],
        elementalAssociation: "Higher compassion",
        soundAssociation: "HUM",
        qrCodePath: "@assets/10. Higher Heart Chakra.png"
      },
      {
        name: "Causal Chakra",
        sanskritName: null,
        number: 11,
        color: "#C0C0C0", // Silver
        location: "Back of the head",
        description: "Represents higher consciousness and spiritual insight. Access to past lives and karmic patterns.",
        healingCode: "222F59426ADB2D16A1E8F9DD8DCE948A8E56A2B46D9FFF3399040E2FD025531B688A4A0D0974A844ACBED2B4FB374A8570C6CF62CA317803329CE62903A36D02",
        keywords: ["karma", "past lives", "higher consciousness", "spiritual insight", "divine timing"],
        elementalAssociation: "Akashic records",
        soundAssociation: "OM AH HUM",
        qrCodePath: "@assets/11. Causal Chakra.png"
      },
      {
        name: "Stellar Gateway Chakra",
        sanskritName: null,
        number: 12,
        color: "#FFD700", // Gold
        location: "Above the soul star chakra",
        description: "Symbolizes divine connection and spiritual ascension. Highest connection point to universal consciousness.",
        healingCode: "D50E4BA8C61E0734E5310A76DEA86371C6BF7186813E2A5A9789743A09892A32413780133E0DAC8819EAC5584045F42833CE2CA5341F432D5ECE4AE44ED902A2",
        keywords: ["ascension", "divine connection", "universal consciousness", "higher dimensions", "cosmic gateway"],
        elementalAssociation: "Universal energy",
        soundAssociation: "OM",
        qrCodePath: "@assets/12. Stellar Gateway Chakra.png"
      }
    ];

    // Add all chakras to storage
    chakraData.forEach(chakra => {
      this.createChakra(chakra);
    });
  }
  
  private initializeCropCircleFormations() {
    // Sample authentic crop circle formations with mathematical representations
    const sampleFormations = [
      {
        name: "Milk Hill Formation",
        location: "Wiltshire, England",
        yearDiscovered: 2001,
        description: "One of the most complex crop formations ever documented, consisting of 409 circles forming a perfect fractal pattern",
        mathematicalPattern: {
          type: "fractal",
          baseRadius: 1,
          circles: 409,
          levels: 6,
          rotation: Math.PI / 6,
          paths: [
            "M 0 0 L 1 0 A 1 1 0 0 0 0.5 0.866 Z",
            "M 3 0 L 4 0 A 1 1 0 0 0 3.5 0.866 Z",
            "M 6 0 L 7 0 A 1 1 0 0 0 6.5 0.866 Z",
            "M 9 0 L 10 0 A 1 1 0 0 0 9.5 0.866 Z",
            "M 12 0 L 13 0 A 1 1 0 0 0 12.5 0.866 Z",
            "M 15 0 L 16 0 A 1 1 0 0 0 15.5 0.866 Z"
          ]
        },
        energeticProperties: {
          frequencies: [432, 864, 1296],
          geometricPrinciple: "hexagonal symmetry",
          fieldEffect: "coherent field amplification"
        }
      },
      {
        name: "Barbury Castle Pi Formation",
        location: "Wiltshire, England",
        yearDiscovered: 2008,
        description: "A formation encoding the first 10 digits of Pi using a spiral and precise angles",
        mathematicalPattern: {
          type: "spiral",
          radius: 1,
          turns: 3.14159,
          points: 10,
          paths: [
            "M 0 0 L 1 0 A 1 1 0 0 0 0 1 Z",
            "M 0 0 L 0 1 A 1 1 0 0 0 -1 0 Z",
            "M 0 0 L -1 0 A 1 1 0 0 0 0 -1 Z",
            "M 0 0 L 0 -1 A 1 1 0 0 0 1 0 Z"
          ]
        },
        energeticProperties: {
          frequencies: [3.14, 6.28, 9.42],
          geometricPrinciple: "spiral golden mean",
          fieldEffect: "information field coherence"
        }
      }
    ];
    
    sampleFormations.forEach(formation => {
      this.createCropCircleFormation(formation);
    });
  }
}

// DrizzleStorage implementation for PostgreSQL
export class DrizzleStorage implements IStorage {
  private db: any;

  constructor(db: any) {
    this.db = db;

    // Initialize schema data
    this.initializeDefaultData();
  }

  private async initializeDefaultData() {
    try {
      // Initialize data only if tables are empty
      const chakraCount = await this.db.select({ count: sql`count(*)` }).from(chakra);
      if (chakraCount.length > 0 && Number(chakraCount[0].count) === 0) {
        this.initializeChakras();
      }
    } catch (error) {
      console.error("Error initializing default data:", error);
    }
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await this.db.select().from(users).where({ id }).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where({ username }).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(insertUser).returning();
    return result[0];
  }
  
  // Soul Archive methods
  async getSoulArchives(): Promise<SoulArchive[]> {
    return await this.db.select().from(soulArchive).orderBy(soulArchive.created_at, 'desc');
  }
  
  async getSoulArchiveById(id: number): Promise<SoulArchive | undefined> {
    const result = await this.db.select().from(soulArchive).where({ id }).limit(1);
    return result[0];
  }
  
  async createSoulArchive(archive: InsertSoulArchive): Promise<SoulArchive> {
    const result = await this.db.insert(soulArchive).values(archive).returning();
    return result[0];
  }
  
  async deleteSoulArchive(id: number): Promise<boolean> {
    const result = await this.db.delete(soulArchive).where({ id }).returning();
    return result.length > 0;
  }
  
  // Healing Code methods
  async getHealingCodes(): Promise<HealingCode[]> {
    return await this.db.select().from(healingCode);
  }
  
  async getHealingCodesByCategory(category: string): Promise<HealingCode[]> {
    return await this.db.select().from(healingCode).where({ category });
  }
  
  async searchHealingCodes(query: string): Promise<HealingCode[]> {
    if (!query) return this.getHealingCodes();
    
    const lowercaseQuery = `%${query.toLowerCase()}%`;
    return await this.db.select().from(healingCode)
      .where(({ or, sql }: { or: any, sql: any }) => or([
        sql`LOWER(${healingCode.code}) LIKE ${lowercaseQuery}`,
        sql`LOWER(${healingCode.description}) LIKE ${lowercaseQuery}`,
        sql`LOWER(${healingCode.category}) LIKE ${lowercaseQuery}`
      ]));
  }
  
  async createHealingCode(code: InsertHealingCode): Promise<HealingCode> {
    const result = await this.db.insert(healingCode).values(code).returning();
    return result[0];
  }
  
  // Energetic Signature methods
  async getEnergeticSignatures(): Promise<EnergeticSignature[]> {
    return await this.db.select().from(energeticSignature);
  }
  
  async getEnergeticSignatureById(id: number): Promise<EnergeticSignature | undefined> {
    const result = await this.db.select().from(energeticSignature).where({ id }).limit(1);
    return result[0];
  }
  
  async getEnergeticSignaturesByCategory(category: string): Promise<EnergeticSignature[]> {
    return await this.db.select().from(energeticSignature).where({ category });
  }
  
  async searchEnergeticSignatures(query: string): Promise<EnergeticSignature[]> {
    if (!query) return this.getEnergeticSignatures();
    
    const lowercaseQuery = `%${query.toLowerCase()}%`;
    return await this.db.select().from(energeticSignature)
      .where(({ or, sql }: { or: any, sql: any }) => or([
        sql`LOWER(${energeticSignature.name}) LIKE ${lowercaseQuery}`,
        sql`LOWER(${energeticSignature.description}) LIKE ${lowercaseQuery}`,
        sql`LOWER(${energeticSignature.category}) LIKE ${lowercaseQuery}`
      ]));
  }
  
  async createEnergeticSignature(signature: InsertEnergeticSignature): Promise<EnergeticSignature> {
    const result = await this.db.insert(energeticSignature).values(signature).returning();
    return result[0];
  }
  
  // Energetic Pattern methods
  async getEnergeticPatterns(): Promise<EnergeticPattern[]> {
    return await this.db.select().from(energeticPattern).orderBy(energeticPattern.created_at, 'desc');
  }
  
  async getEnergeticPatternById(id: number): Promise<EnergeticPattern | undefined> {
    const result = await this.db.select().from(energeticPattern).where({ id }).limit(1);
    return result[0];
  }
  
  async getUserEnergeticPatterns(userId: number): Promise<EnergeticPattern[]> {
    return await this.db.select().from(energeticPattern)
      .where({ userId })
      .orderBy(energeticPattern.created_at, 'desc');
  }
  
  async createEnergeticPattern(pattern: InsertEnergeticPattern): Promise<EnergeticPattern> {
    const result = await this.db.insert(energeticPattern).values(pattern).returning();
    return result[0];
  }
  
  async deleteEnergeticPattern(id: number): Promise<boolean> {
    const result = await this.db.delete(energeticPattern).where({ id }).returning();
    return result.length > 0;
  }
  
  // Crop Circle Formation methods
  async getCropCircleFormations(): Promise<CropCircleFormation[]> {
    return await this.db.select().from(cropCircleFormation);
  }
  
  async getCropCircleFormationById(id: number): Promise<CropCircleFormation | undefined> {
    const result = await this.db.select().from(cropCircleFormation).where({ id }).limit(1);
    return result[0];
  }
  
  async createCropCircleFormation(formation: InsertCropCircleFormation): Promise<CropCircleFormation> {
    const result = await this.db.insert(cropCircleFormation).values(formation).returning();
    return result[0];
  }
  
  // Spirit Communication methods
  async getSpiritCommunications(): Promise<SpiritCommunication[]> {
    return await this.db.select().from(spiritCommunication).orderBy(spiritCommunication.timestamp, 'desc');
  }
  
  async getSpiritCommunicationById(id: number): Promise<SpiritCommunication | undefined> {
    const result = await this.db.select().from(spiritCommunication).where({ id }).limit(1);
    return result[0];
  }
  
  async getUserSpiritCommunications(userId: number): Promise<SpiritCommunication[]> {
    return await this.db.select().from(spiritCommunication)
      .where({ userId })
      .orderBy(spiritCommunication.timestamp, 'desc');
  }
  
  async createSpiritCommunication(communication: InsertSpiritCommunication): Promise<SpiritCommunication> {
    const result = await this.db.insert(spiritCommunication).values(communication).returning();
    return result[0];
  }

  // Chakra methods
  async getChakras(): Promise<Chakra[]> {
    return await this.db.select().from(chakra).orderBy(chakra.number);
  }

  async getChakraById(id: number): Promise<Chakra | undefined> {
    const result = await this.db.select().from(chakra).where({ id }).limit(1);
    return result[0];
  }

  async getChakraByNumber(number: number): Promise<Chakra | undefined> {
    const result = await this.db.select().from(chakra).where({ number }).limit(1);
    return result[0];
  }

  async createChakra(chakraData: InsertChakra): Promise<Chakra> {
    const result = await this.db.insert(chakra).values(chakraData).returning();
    return result[0];
  }

  // Chakra Healing Session methods
  async getChakraHealingSessions(): Promise<ChakraHealingSession[]> {
    return await this.db.select().from(chakraHealingSession)
      .orderBy(chakraHealingSession.timestamp, 'desc');
  }

  async getChakraHealingSessionById(id: number): Promise<ChakraHealingSession | undefined> {
    const result = await this.db.select().from(chakraHealingSession).where({ id }).limit(1);
    return result[0];
  }

  async getUserChakraHealingSessions(userId: number): Promise<ChakraHealingSession[]> {
    return await this.db.select().from(chakraHealingSession)
      .where({ userId })
      .orderBy(chakraHealingSession.timestamp, 'desc');
  }

  async createChakraHealingSession(session: InsertChakraHealingSession): Promise<ChakraHealingSession> {
    const result = await this.db.insert(chakraHealingSession).values(session).returning();
    return result[0];
  }

  async updateChakraHealingSessionStatus(id: number, status: string): Promise<ChakraHealingSession | undefined> {
    const result = await this.db.update(chakraHealingSession)
      .set({ status })
      .where({ id })
      .returning();
    return result[0];
  }

  // Initialize data
  private async initializeChakras() {
    // Default chakras for the 12-chakra system
    const defaultChakras = [
      {
        number: 1,
        name: "Root Chakra",
        sanskritName: "Muladhara",
        color: "red",
        element: "earth",
        location: "base of spine",
        frequency: 396,
        healingCode: "741",
        description: "The Root Chakra provides a foundation for all higher chakras. It is responsible for your sense of security and stability.",
        qrCodePath: "@assets/1. Root Chakra.png"
      },
      {
        number: 2,
        name: "Sacral Chakra",
        sanskritName: "Svadhisthana",
        color: "orange",
        element: "water",
        location: "lower abdomen",
        frequency: 417,
        healingCode: "852",
        description: "The Sacral Chakra relates to creativity, sexual energy, and emotional balance. It governs your ability to experience pleasure.",
        qrCodePath: "@assets/2. Sacral Chakra.png"
      },
      {
        number: 3,
        name: "Solar Plexus Chakra",
        sanskritName: "Manipura",
        color: "yellow",
        element: "fire",
        location: "upper abdomen",
        frequency: 528,
        healingCode: "963",
        description: "The Solar Plexus Chakra is the center of personal power, confidence, and self-esteem. It governs your sense of identity and autonomy.",
        qrCodePath: "@assets/3. Solar Plexus Chakra.png"
      },
      {
        number: 4,
        name: "Heart Chakra",
        sanskritName: "Anahata",
        color: "green",
        element: "air",
        location: "center of chest",
        frequency: 639,
        healingCode: "174",
        description: "The Heart Chakra is the bridge between the lower and higher chakras. It governs love, compassion, and acceptance of self and others.",
        qrCodePath: "@assets/4. Heart Chakra.png"
      },
      {
        number: 5,
        name: "Throat Chakra",
        sanskritName: "Vishuddha",
        color: "blue",
        element: "ether",
        location: "throat",
        frequency: 741,
        healingCode: "285",
        description: "The Throat Chakra is the center of communication, self-expression, and truth. It governs your ability to speak your authentic self.",
        qrCodePath: "@assets/5. Throat Chakra.png"
      },
      {
        number: 6,
        name: "Third Eye Chakra",
        sanskritName: "Ajna",
        color: "indigo",
        element: "light",
        location: "center of forehead",
        frequency: 852,
        healingCode: "396",
        description: "The Third Eye Chakra is the center of intuition, wisdom, and insight. It governs your perception beyond the physical world.",
        qrCodePath: "@assets/6. Third Eye Chakra.png"
      },
      {
        number: 7,
        name: "Crown Chakra",
        sanskritName: "Sahasrara",
        color: "violet",
        element: "cosmic energy",
        location: "top of head",
        frequency: 963,
        healingCode: "417",
        description: "The Crown Chakra connects you to universal consciousness and your higher purpose. It governs spiritual connection and enlightenment.",
        qrCodePath: "@assets/7. Crown Chakra.png"
      },
      {
        number: 8,
        name: "Earth Star Chakra",
        sanskritName: "Prithvi",
        color: "brown",
        element: "earth crystal",
        location: "below feet",
        frequency: 174,
        healingCode: "528",
        description: "The Earth Star Chakra grounds your energy to the Earth. It provides stability and anchors your higher energy centers.",
        qrCodePath: "@assets/8. Earth Star Chakra.png"
      },
      {
        number: 9,
        name: "Soul Star Chakra",
        sanskritName: "Atma",
        color: "white",
        element: "soul essence",
        location: "above head",
        frequency: 285,
        healingCode: "639",
        description: "The Soul Star Chakra connects you to your soul's blueprint and higher purpose. It governs spiritual growth and soul evolution.",
        qrCodePath: "@assets/9. Soul Star Chakra.png"
      },
      {
        number: 10,
        name: "Higher Heart Chakra",
        sanskritName: "Ananda Kanda",
        color: "pink",
        element: "divine love",
        location: "upper chest",
        frequency: 396,
        healingCode: "741",
        description: "The Higher Heart Chakra is the center of unconditional love, compassion, and forgiveness. It facilitates spiritual awakening.",
        qrCodePath: "@assets/10. Higher Heart Chakra.png"
      },
      {
        number: 11,
        name: "Causal Chakra",
        sanskritName: "Karana",
        color: "gold",
        element: "akashic records",
        location: "back of head",
        frequency: 417,
        healingCode: "852",
        description: "The Causal Chakra is the repository of all past life experiences and karma. It governs your spiritual evolution across lifetimes.",
        qrCodePath: "@assets/11. Causal Chakra.png"
      },
      {
        number: 12,
        name: "Stellar Gateway Chakra",
        sanskritName: "Nakshetra",
        color: "silver",
        element: "stellar light",
        location: "far above head",
        frequency: 528,
        healingCode: "963",
        description: "The Stellar Gateway Chakra connects you to the cosmos and interdimensional planes. It facilitates access to universal wisdom.",
        qrCodePath: "@assets/12. Stellar Gateway Chakra.png"
      }
    ];

    for (const chakraData of defaultChakras) {
      await this.createChakra(chakraData);
    }
  }
}

// Use DrizzleStorage in production, otherwise MemStorage for development
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

let storage: IStorage;

if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
  console.log("Using DrizzleStorage with PostgreSQL database");
  const client = postgres(process.env.DATABASE_URL);
  const db = drizzle(client);
  storage = new DrizzleStorage(db);
} else {
  console.log("Using MemStorage (no database connection)");
  storage = new MemStorage();
}

export { storage };
