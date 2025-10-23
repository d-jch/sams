import { Client } from "@db/postgres";
import "@std/dotenv/load";

let client: Client | null = null;

// 加载 RDS CA 证书
async function resolveCaPem(): Promise<string | undefined> {
  const envPem = Deno.env.get("DB_CA_PEM");
  if (envPem) return envPem;
  try {
    const caPath = new URL("./global-bundle.pem", import.meta.url).pathname;
    return await Deno.readTextFile(caPath);
  } catch {
    return undefined;
  }
}

export async function getDb() {
  if (!client) {
    const caPem = await resolveCaPem();
    // 解析数据库连接信息
    const DATABASE_URL = Deno.env.get("DATABASE_URL");
    if (!DATABASE_URL) throw new Error("DATABASE_URL not configured");
    const url = new URL(DATABASE_URL);
    const user = decodeURIComponent(url.username || "");
    const password = decodeURIComponent(url.password || "");
    const hostname = url.hostname;
    const port = url.port ? Number(url.port) : 5432;
    const database = url.pathname ? url.pathname.replace(/^\//, "") : undefined;

    client = new Client({
      user: user || undefined,
      password: password || undefined,
      hostname,
      port,
      database,
      tls: caPem
        ? {
          enabled: true,
          enforce: true,
          caCertificates: [caPem],
        }
        : undefined,
    });

    await client.connect();
  }
  return client;
}

export async function closeDb() {
  if (client) {
    await client.end();
    client = null;
  }
}
