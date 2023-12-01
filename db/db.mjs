import pg from "pg";
import 'dotenv/config'
const { Pool } = pg;
export function createPool() {
  return new Pool({
    user: 'Student@psql-bookshop.postgres.database.azure.com',
    host: 'psql-bookshop.postgres.database.azure.com',
    database: 'saitynai',
    password: 'HarBar17443',
    port: 5432,
  });
}