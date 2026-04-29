require("dotenv").config({ path: ".env" });
const { Client } = require("pg");

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const userId = `debug-${Date.now()}`;
  const accountId = `debug-account-${Date.now()}`;
  const email = `debug${Date.now()}@mail.com`;

  try {
    await client.query("BEGIN");

    await client.query(
      `INSERT INTO public.user (id, name, email, "emailVerified", "createdAt", "updatedAt", role, "profileType")
       VALUES ($1, $2, $3, $4, NOW(), NOW(), $5, $6)`,
      [userId, "Debug User", email, false, "user", "Analista"],
    );

    await client.query(
      `INSERT INTO public.account (id, "accountId", "providerId", "userId", password, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
      [accountId, accountId, "credential", userId, "hashed-password"],
    );

    await client.query("ROLLBACK");
    console.log("OK: insert user/account works in Neon");
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch {
      // ignore rollback failures in debug flow
    }
    console.error("ERR:", error.message);
    console.error(error);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

run();
