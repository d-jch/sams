import { Pool } from "@db/postgres";
import { getConfig } from "./config.ts";

let pool: Pool | null = null;

export async function getDatabase(): Promise<Pool> {
  if (pool) {
    return pool;
  }

  const config = await getConfig();
  
  pool = new Pool(config.database.url, 10, true);

  return pool;
}

export async function closeDatabase(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

// Test database connection
export async function testConnection(): Promise<boolean> {
  try {
    const db = await getDatabase();
    const client = await db.connect();
    try {
      const result = await client.queryObject<{ now: Date }>("SELECT NOW() as now");
      console.log("Database connection successful:", result.rows[0].now);
      return true;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  }
}