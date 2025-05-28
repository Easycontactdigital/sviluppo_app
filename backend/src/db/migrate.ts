import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const runMigrations = async () => {
  console.log('Checking database configuration environment variables...');
  if (!process.env.POSTGRES_HOST ||
      !process.env.POSTGRES_PORT ||
      !process.env.POSTGRES_DB ||
      !process.env.POSTGRES_USER ||
      !process.env.POSTGRES_PASSWORD) {
    console.error('Missing database configuration environment variables');
    throw new Error('Missing database configuration environment variables');
  }
  console.log('Database configuration environment variables found.');

  console.log('Creating database connection pool...');
  const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT),
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });
  console.log('Database connection pool created.');

  const db = drizzle(pool);

  console.log('Running migrations...');

  // Add logging for _journal.json content
  const journalPath = path.join(__dirname, '..', '..', 'drizzle', 'meta', '_journal.json');
  try {
    const journalContent = fs.readFileSync(journalPath, 'utf-8');
    console.log(`Content of ${journalPath}:`, journalContent);
    const journal = JSON.parse(journalContent);
    console.log('Parsed journal:', journal);
  } catch (error) {
    console.error(`Error reading or parsing ${journalPath}:`, error);
  }

  try {
    await migrate(db, { migrationsFolder: 'drizzle' });
    console.log('✅ Migrations completed successfully');
  } catch (error) {
    console.error('❌ Error running migrations:', error);
    throw error;
  } finally {
    console.log('Ending database connection pool.');
    await pool.end();
    console.log('Database connection pool ended.');
  }
};

runMigrations().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});