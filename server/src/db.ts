import dotenv from 'dotenv'
import { Router } from 'express';
import postgres from 'postgres';

dotenv.config()

export const habitRouter = Router()
const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

export const conn = postgres({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: 'require',
});
