import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "../shared/schema";

// Configure Neon database to use WebSockets for serverless environment
neonConfig.webSocketConstructor = ws;

// Create connection pool with Vercel cache
let cachedConnection;

function createPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL must be set. Did you forget to provision a database?"
    );
  }
  return new Pool({ connectionString: process.env.DATABASE_URL });
}

function getDb() {
  if (!cachedConnection) {
    const pool = createPool();
    cachedConnection = drizzle({ client: pool, schema });
  }
  return cachedConnection;
}

// Export the database connection
export const db = getDb();