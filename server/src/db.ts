import dotenv from 'dotenv'
import postgres from 'postgres';

dotenv.config()

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

export const conn = postgres({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: 'require',
});
