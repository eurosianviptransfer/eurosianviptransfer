#!/usr/bin/env node
const { Client } = require('pg');

const args = process.argv.slice(2);
const explicitUrlIndex = args.findIndex((arg: string) => arg === '--url' || arg === '-u');
const connectionString = explicitUrlIndex >= 0 ? args[explicitUrlIndex + 1] : process.env.DATABASE_URL;

if (!connectionString) {
  console.error('Error: DATABASE_URL is not set and --url was not provided.');
  console.error('Usage: DATABASE_URL="postgresql://user:pass@host:5432/dbname?sslmode=require" node scripts/db-connection-check.js');
  console.error('   or: npx node scripts/db-connection-check.js --url "postgresql://user:pass@host:5432/dbname?sslmode=require"');
  process.exit(1);
}

const client = new Client({ connectionString });

async function main() {
  try {
    await client.connect();
    const result = await client.query('SELECT current_database() AS database, current_user AS user, now() AS now');
    const row = result.rows[0];
    console.log('✅ Database connection succeeded.');
    console.log(`Database: ${row.database}`);
    console.log(`User:     ${row.user}`);
    console.log(`Time:     ${row.now}`);
    const version = await client.query('SHOW server_version');
    console.log(`Server:   ${version.rows[0].server_version}`);
  } catch (error) {
    console.error('❌ Connection failed:', error instanceof Error ? error.message : error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();