import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { healingCode, chakra } from '@shared/schema';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function initializeDatabase() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL environment variable not set");
    process.exit(1);
  }

  console.log("Initializing database with healing codes and chakra data...");
  const client = postgres(process.env.DATABASE_URL);
  const db = drizzle(client);

  // Check if we already have healing codes
  const existingCodes = await db.execute<{ count: number }>(sql`SELECT COUNT(*) as count FROM healing_code`);
  const codesCount = existingCodes[0]?.count || 0;
  
  // Check if we already have chakra data
  const existingChakras = await db.execute<{ count: number }>(sql`SELECT COUNT(*) as count FROM chakra`);
  const chakrasCount = existingChakras[0]?.count || 0;
  
  console.log(`Database has ${codesCount} healing codes and ${chakrasCount} chakras.`);
  
  // If both tables have data, we can exit
  if (codesCount > 0 && chakrasCount > 0) {
    console.log(`Database already initialized. Skipping initialization.`);
    return;
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
    
    // Initialize chakra data if needed
    if (chakrasCount === 0) {
      console.log("Initializing chakra data...");
      const chakraData = [
        {
          number: 1,
          name: "Root Chakra",
          sanskritName: "Muladhara",
          color: "red",
          element: "earth",
          location: "base of spine",
          description: "The Root Chakra provides a foundation for all higher chakras. It is responsible for your sense of security and stability.",
          healingCode: "741",
          qrCodePath: "/assets/1.%20Root%20Chakra.png"
        },
        {
          number: 2,
          name: "Sacral Chakra",
          sanskritName: "Svadhisthana",
          color: "orange",
          element: "water",
          location: "lower abdomen",
          description: "The Sacral Chakra relates to creativity, sexual energy, and emotional balance. It governs your ability to experience pleasure.",
          healingCode: "852",
          qrCodePath: "/assets/2.%20Sacral%20Chakra.png"
        },
        {
          number: 3,
          name: "Solar Plexus Chakra",
          sanskritName: "Manipura",
          color: "yellow",
          element: "fire",
          location: "upper abdomen",
          description: "The Solar Plexus Chakra is the center of personal power, confidence, and self-esteem. It governs your sense of identity and autonomy.",
          healingCode: "963",
          qrCodePath: "/assets/3.%20Solar%20Plexus%20Chakra.png"
        },
        {
          number: 4,
          name: "Heart Chakra",
          sanskritName: "Anahata",
          color: "green",
          element: "air",
          location: "center of chest",
          description: "The Heart Chakra is the bridge between the lower and higher chakras. It governs love, compassion, and acceptance of self and others.",
          healingCode: "174",
          qrCodePath: "/assets/4.%20Heart%20Chakra.png"
        },
        {
          number: 5,
          name: "Throat Chakra",
          sanskritName: "Vishuddha",
          color: "blue",
          element: "ether",
          location: "throat",
          description: "The Throat Chakra is the center of communication, self-expression, and truth. It governs your ability to speak your authentic self.",
          healingCode: "285",
          qrCodePath: "/assets/5.%20Throat%20Chakra.png"
        },
        {
          number: 6,
          name: "Third Eye Chakra",
          sanskritName: "Ajna",
          color: "indigo",
          element: "light",
          location: "center of forehead",
          description: "The Third Eye Chakra is the center of intuition, wisdom, and insight. It governs your perception beyond the physical world.",
          healingCode: "396",
          qrCodePath: "/assets/6.%20Third%20Eye%20Chakra.png"
        },
        {
          number: 7,
          name: "Crown Chakra",
          sanskritName: "Sahasrara",
          color: "violet",
          element: "cosmic energy",
          location: "top of head",
          description: "The Crown Chakra connects you to universal consciousness and your higher purpose. It governs spiritual connection and enlightenment.",
          healingCode: "417",
          qrCodePath: "/assets/7.%20Crown%20Chakra.png"
        },
        {
          number: 8,
          name: "Earth Star Chakra",
          sanskritName: "Prithvi",
          color: "brown",
          element: "earth crystal",
          location: "below feet",
          description: "The Earth Star Chakra grounds your energy to the Earth. It provides stability and anchors your higher energy centers.",
          healingCode: "528",
          qrCodePath: "/assets/8.%20Earth%20Star%20Chakra.png"
        },
        {
          number: 9,
          name: "Soul Star Chakra",
          sanskritName: "Atma",
          color: "white",
          element: "soul essence",
          location: "above head",
          description: "The Soul Star Chakra connects you to your soul's blueprint and higher purpose. It governs spiritual growth and soul evolution.",
          healingCode: "639",
          qrCodePath: "/assets/9.%20Soul%20Star%20Chakra.png"
        },
        {
          number: 10,
          name: "Higher Heart Chakra",
          sanskritName: "Ananda Kanda",
          color: "pink",
          element: "divine love",
          location: "upper chest",
          description: "The Higher Heart Chakra is the center of unconditional love, compassion, and forgiveness. It facilitates spiritual awakening.",
          healingCode: "741",
          qrCodePath: "/assets/10.%20Higher%20Heart%20Chakra.png"
        },
        {
          number: 11,
          name: "Causal Chakra",
          sanskritName: "Karana",
          color: "gold",
          element: "akashic records",
          location: "back of head",
          description: "The Causal Chakra is the repository of all past life experiences and karma. It governs your spiritual evolution across lifetimes.",
          healingCode: "852",
          qrCodePath: "/assets/11.%20Causal%20Chakra.png"
        },
        {
          number: 12,
          name: "Stellar Gateway Chakra",
          sanskritName: "Nakshetra",
          color: "silver",
          element: "stellar light",
          location: "far above head",
          description: "The Stellar Gateway Chakra connects you to the cosmos and interdimensional planes. It facilitates access to universal wisdom.",
          healingCode: "963",
          qrCodePath: "/assets/12.%20Stellar%20Gateway%20Chakra.png"
        }
      ];
      
      console.log("Inserting chakra data into database...");
      for (const data of chakraData) {
        await db.insert(chakra).values(data);
      }
      console.log(`Successfully added ${chakraData.length} chakras to database.`);
    }
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