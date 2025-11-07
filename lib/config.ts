import { load } from "@std/dotenv";

export interface Config {
  database: {
    url: string;
  };
  jwt: {
    secret: string;
    accessTokenExpiresMinutes: number;
    refreshTokenExpiresDays: number;
  };
  logging: {
    level: string;
  };
}

let config: Config | null = null;

export async function getConfig(): Promise<Config> {
  if (config) {
    return config;
  }

  // Load .env file
  const env = await load();

  // Validate required environment variables
  const databaseUrl = env.DATABASE_URL || Deno.env.get("DATABASE_URL");
  const jwtSecret = env.JWT_SECRET || Deno.env.get("JWT_SECRET");

  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is required");
  }
  
  if (!jwtSecret) {
    throw new Error("JWT_SECRET environment variable is required");
  }

  config = {
    database: {
      url: databaseUrl,
    },
    jwt: {
      secret: jwtSecret,
      accessTokenExpiresMinutes: parseInt(
        env.ACCESS_TOKEN_EXPIRES_MINUTES || 
        Deno.env.get("ACCESS_TOKEN_EXPIRES_MINUTES") || 
        "15"
      ),
      refreshTokenExpiresDays: parseInt(
        env.REFRESH_TOKEN_EXPIRES_DAYS || 
        Deno.env.get("REFRESH_TOKEN_EXPIRES_DAYS") || 
        "7"
      ),
    },
    logging: {
      level: env.LOG_LEVEL || Deno.env.get("LOG_LEVEL") || "info",
    },
  };

  return config;
}

export function resetConfig(): void {
  config = null;
}