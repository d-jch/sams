import { assert } from "@std/assert";
import { getDb } from "@/src/db.ts";

Deno.test("db: connect and create users table (integration)", async () => {
  const client = await getDb();
  try {
    const result = await client.queryArray(
      "CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name TEXT NOT NULL);",
    );
    assert(result);
  } finally {
    // Clean up: drop the users table after test
    await client.queryArray("DROP TABLE IF EXISTS users;");
    await client.end();
  }
});
