import { pgTable, text, serial, integer, boolean, timestamp, json, real, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Soul Archive model for storing sacred geometry patterns
export const soulArchive = pgTable("soul_archive", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  intention: text("intention"),
  frequency: text("frequency").notNull(),
  boost: boolean("boost").default(false),
  multiplier: integer("multiplier").default(1),
  pattern_type: text("pattern_type").notNull(), // torus, merkaba, metatron, sri_yantra, flower_of_life
  pattern_data: json("pattern_data").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const insertSoulArchiveSchema = createInsertSchema(soulArchive).omit({
  id: true,
  created_at: true,
});

export type InsertSoulArchive = z.infer<typeof insertSoulArchiveSchema>;
export type SoulArchive = typeof soulArchive.$inferSelect;

// Healing Codes model for storing numerical healing codes
export const healingCode = pgTable("healing_code", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  description: text("description").notNull(),
  category: text("category"),
  codeType: text("code_type").notNull().default("grabovoi"), // 'divine' or 'grabovoi'
});

export const insertHealingCodeSchema = createInsertSchema(healingCode).omit({
  id: true,
});

export type InsertHealingCode = z.infer<typeof insertHealingCodeSchema>;
export type HealingCode = typeof healingCode.$inferSelect;

// Energetic Signature model for storing mathematical representations of energetic patterns
export const energeticSignature = pgTable("energetic_signature", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // element, emotion, bodySystem, naturalPhenomenon, consciousness
  description: text("description"),
  baseFrequency: real("base_frequency"), // Hertz value of the primary frequency
  harmonics: json("harmonics"), // Array of harmonic frequencies
  waveform: text("waveform"), // sine, square, triangle, sawtooth
  mathematicalFormula: text("mathematical_formula"), // Equation representing the pattern
  geometryType: text("geometry_type"), // The type of sacred geometry associated
  colorSpectrum: text("color_spectrum"), // Color association (hex values)
  numericalSequence: varchar("numerical_sequence", { length: 100 }), // Numerical code like Grabovoi
  visualPattern: json("visual_pattern"), // Mathematical definition for visualization
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const insertEnergeticSignatureSchema = createInsertSchema(energeticSignature).omit({
  id: true,
  created_at: true,
});

export type InsertEnergeticSignature = z.infer<typeof insertEnergeticSignatureSchema>;
export type EnergeticSignature = typeof energeticSignature.$inferSelect;

// Energetic Pattern model for storing user-generated combinations of signatures
export const energeticPattern = pgTable("energetic_pattern", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  intention: text("intention"),
  userId: integer("user_id").references(() => users.id),
  signatures: json("signatures"), // Array of energetic signature IDs and their weights
  visualSettings: json("visual_settings"), // Settings for the visualization
  audioSettings: json("audio_settings"), // Settings for audio generation
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const insertEnergeticPatternSchema = createInsertSchema(energeticPattern).omit({
  id: true,
  created_at: true,
});

export type InsertEnergeticPattern = z.infer<typeof insertEnergeticPatternSchema>;
export type EnergeticPattern = typeof energeticPattern.$inferSelect;

// Crop Circle Formations - stores mathematical patterns of authentic crop circles
export const cropCircleFormation = pgTable("crop_circle_formation", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location"),
  yearDiscovered: integer("year_discovered"),
  description: text("description"),
  mathematicalPattern: json("mathematical_pattern").notNull(), // Vector paths for drawing
  energeticProperties: json("energetic_properties"), // Associated energetic properties
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const insertCropCircleFormationSchema = createInsertSchema(cropCircleFormation).omit({
  id: true,
  created_at: true,
});

export type InsertCropCircleFormation = z.infer<typeof insertCropCircleFormationSchema>;
export type CropCircleFormation = typeof cropCircleFormation.$inferSelect;
