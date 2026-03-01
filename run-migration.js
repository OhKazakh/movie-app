#!/usr/bin/env node
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
});

const sql = fs.readFileSync(
  path.join(__dirname, 'prisma/migrations/20250301000000_init/migration.sql'),
  'utf8'
);

client
  .connect()
  .then(() => client.query(sql))
  .then(() => {
    console.log('Migration applied successfully');
    return client.end();
  })
  .then(() => process.exit(0))
  .catch((err) => {
    if (err.code === '42P07') {
      console.log('Table already exists, migration skipped');
      return client.end();
    }
    console.error(err);
    process.exit(1);
  });
