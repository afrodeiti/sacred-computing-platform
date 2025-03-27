import { 
  users, type User, type InsertUser,
  soulArchive, type SoulArchive, type InsertSoulArchive,
  healingCode, type HealingCode, type InsertHealingCode
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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private soulArchives: Map<number, SoulArchive>;
  private healingCodes: Map<number, HealingCode>;
  
  currentUserId: number;
  currentArchiveId: number;
  currentCodeId: number;

  constructor() {
    this.users = new Map();
    this.soulArchives = new Map();
    this.healingCodes = new Map();
    
    this.currentUserId = 1;
    this.currentArchiveId = 1;
    this.currentCodeId = 1;
    
    // Initialize with sample healing codes from the uploaded file
    this.initializeHealingCodes();
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
    return await this.db.select().from(soulArchive).orderBy(({ desc }: { desc: any }) => [desc(soulArchive.created_at)]);
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
}

// Use MemStorage for development
// In production, use DrizzleStorage with the database connection
export const storage = new MemStorage();
