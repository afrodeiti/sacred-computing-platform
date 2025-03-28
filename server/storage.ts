import { 
  users, type User, type InsertUser,
  soulArchive, type SoulArchive, type InsertSoulArchive,
  healingCode, type HealingCode, type InsertHealingCode,
  energeticSignature, type EnergeticSignature, type InsertEnergeticSignature,
  energeticPattern, type EnergeticPattern, type InsertEnergeticPattern,
  cropCircleFormation, type CropCircleFormation, type InsertCropCircleFormation
} from "@shared/schema";

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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private soulArchives: Map<number, SoulArchive>;
  private healingCodes: Map<number, HealingCode>;
  private energeticSignatures: Map<number, EnergeticSignature>;
  private energeticPatterns: Map<number, EnergeticPattern>;
  private cropCircleFormations: Map<number, CropCircleFormation>;
  
  currentUserId: number;
  currentArchiveId: number;
  currentCodeId: number;
  currentSignatureId: number;
  currentPatternId: number;
  currentFormationId: number;

  constructor() {
    this.users = new Map();
    this.soulArchives = new Map();
    this.healingCodes = new Map();
    this.energeticSignatures = new Map();
    this.energeticPatterns = new Map();
    this.cropCircleFormations = new Map();
    
    this.currentUserId = 1;
    this.currentArchiveId = 1;
    this.currentCodeId = 1;
    this.currentSignatureId = 1;
    this.currentPatternId = 1;
    this.currentFormationId = 1;
    
    // Initialize with sample data
    this.initializeHealingCodes();
    this.initializeEnergeticSignatures();
    this.initializeCropCircleFormations();
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
      category: code.category ?? null
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

  // Initialize with sample data
  private initializeHealingCodes() {
    // Sample healing codes from the uploaded file
    const sampleCodes = [
      { code: "23 74 555", description: "Healing headaches in general", category: "CENTRAL NERVOUS SYSTEM" },
      { code: "58 33 554", description: "Healing migraine", category: "CENTRAL NERVOUS SYSTEM" },
      { code: "71 81 533", description: "Back pain relief", category: "CENTRAL NERVOUS SYSTEM" },
      { code: "33 45 10101", description: "Forgiveness", category: "PSYCHOLOGICAL CONCERNS" },
      { code: "11 96 888", description: "Low self-esteem to healthy self-image", category: "SELF-HELP" },
      { code: "8888", description: "Divine protection", category: "SPIRITUAL" },
      { code: "13 13 514", description: "Stress relief/relaxation", category: "SELF-HELP" },
      { code: "517 489719 841", description: "Increase self-confidence", category: "SELF-HELP" },
      { code: "56 57 893", description: "Unconditional love", category: "RELATIONSHIPS" },
      { code: "888 412 1289018", description: "Love (general & relationships)", category: "RELATIONSHIPS" }
    ];
    
    sampleCodes.forEach(code => {
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
