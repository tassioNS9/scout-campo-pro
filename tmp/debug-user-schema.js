require("dotenv").config({ path: ".env.local" });
const { Client } = require("pg");

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  const result = await client.query(
    "select column_name,data_type,is_nullable,column_default from information_schema.columns where table_schema='public' and table_name='user' order by ordinal_position",
  );
  console.table(result.rows);
  await client.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
