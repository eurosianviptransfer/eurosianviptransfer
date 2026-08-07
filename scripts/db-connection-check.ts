#!/usr/bin/env tsx
import { Client } from "pg";

const args = process.argv.slice(2);
const showHelp = args.includes("--help") || args.includes("-h");

if (showHelp) {
  console.log(`Usage:\n  DATABASE_URL='postgresql://user:password@host:5432/dbname?sslmode=require' npx tsx scripts/db-connection-check.ts\n  Or:\n  npx tsx scripts/db-connection-check.ts --url 'postgresql://user:password@host:5432/dbname?sslmode=require'\n`);
  process.exit(0);
}

const explicitUrlIndex = args.findIndex((arg) => arg === "--url" || arg === "-u");
const connectionString = explicitUrlIndex >= 0 ? args[explicitUrlIndex + 1] : process.env.DATABASE_URL;

if (\!connectionString) {
  console.error("Error: DATABASE_URL is not set and --url was not provided.");
  console.error("Set DATABASE_URL in your shell or pass --url with the full Postgres URL.");
  process.exit(1);
}

const client = new Client({ connectionString });

async function main() {
  try {
    await client.connect();
    const result = await client.query(`SELECT current_database() AS database, current_user AS user, now() AS now`);
    const row = result.rows[0];

    console.log("✅ Database connection succeeded.");
    console.log(`Database: ${row.database}`);
    console.log(`User:     ${row.user}`);
    console.log(`Time:     ${row.now}`);

    const version = await client.query(`SHOW server_version`);
    console.log(`Server:   ${version.rows[0].server_version}`);
  } catch (error) {
    console.error("❌ Connection failed:", error instanceof Error ? error.message : error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
