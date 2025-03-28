import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { healingCode } from '@shared/schema';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { dirname } from 'path';

async function initializeDatabase() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL environment variable not set");
    process.exit(1);
  }

  console.log("Initializing database with healing codes...");
  const client = postgres(process.env.DATABASE_URL);
  const db = drizzle(client);

  // First, check if we already have healing codes
  const existingCodes = await db.execute<{ count: number }>(sql`SELECT COUNT(*) as count FROM healing_code`);
  const count = existingCodes[0]?.count || 0;
  if (count > 0) {
    console.log(`Database already has ${count} healing codes.`);
    process.exit(0);
  }

  // Load Grabovoi codes from the attached file
  let healingCodesData: { code: string; description: string; category: string; }[] = [];
  
  try {
    // Try to read from the attached assets file
    const grabovoiFilePath = path.resolve(__dirname, '../attached_assets/GRABOVOI CODES.txt');
    console.log(`Looking for file at: ${grabovoiFilePath}`);
    
    if (fs.existsSync(grabovoiFilePath)) {
      console.log("File found, reading content...");
      const fileContent = fs.readFileSync(grabovoiFilePath, 'utf8');
      const lines = fileContent.split('\n');
      
      // Skip header lines
      const contentLines = lines.filter(line => 
        line.trim() !== '' && 
        !line.includes('GRABOVOI CODES:') && 
        line.includes('-')
      );
      
      console.log(`Found ${contentLines.length} content lines`);
      
      for (const line of contentLines) {
        try {
          const parts = line.split('-');
          if (parts.length >= 2) {
            const code = parts[0].trim();
            let description = parts[1].trim();
            let category = 'GENERAL';
            
            // Check if the description contains a category in parentheses
            const categoryMatch = description.match(/(.+?)\s*\((.+?)\)$/);
            if (categoryMatch) {
              description = categoryMatch[1].trim();
              category = categoryMatch[2].trim();
            }
            
            healingCodesData.push({
              code,
              description,
              category
            });
          }
        } catch (error) {
          console.error(`Error parsing line: ${line}`, error);
        }
      }
      
      console.log(`Loaded ${healingCodesData.length} healing codes from file.`);
    } else {
      console.log("Grabovoi codes file not found, using fallback sample data.");
      // Fallback to sample data if file not found
      healingCodesData = [
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
    }
    
    // Insert healing codes into the database
    console.log("Inserting healing codes into database...");
    for (const codeData of healingCodesData) {
      await db.insert(healingCode).values(codeData);
    }
    
    console.log(`Successfully added ${healingCodesData.length} healing codes to database.`);
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Import sql for raw SQL count query
import { sql } from 'drizzle-orm';

// Run the initialization
initializeDatabase().then(() => {
  console.log("Database initialization complete.");
}).catch(err => {
  console.error("Failed to initialize database:", err);
  process.exit(1);
});