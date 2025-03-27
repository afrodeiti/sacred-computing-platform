import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
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
});

export const insertHealingCodeSchema = createInsertSchema(healingCode).omit({
  id: true,
});

export type InsertHealingCode = z.infer<typeof insertHealingCodeSchema>;
export type HealingCode = typeof healingCode.$inferSelect;
