require("dotenv").config({ path: ".env.local" });
const { Client } = require("pg");

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  await client.query(
    'ALTER TABLE "user" ALTER COLUMN "emailVerified" DROP DEFAULT;',
  );
  await client.query(
    'ALTER TABLE "user" ALTER COLUMN "emailVerified" TYPE boolean USING CASE WHEN "emailVerified" IS NULL THEN false ELSE true END;',
  );
  await client.query(
    'ALTER TABLE "user" ALTER COLUMN "emailVerified" SET DEFAULT false;',
  );

  console.log("OK: emailVerified convertido para boolean");
  await client.end();
}

main().catch(async (error) => {
  console.error(error.message);
  process.exit(1);
});
