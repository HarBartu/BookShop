import pg from "pg";
import 'dotenv/config'
const { Pool } = pg;
export function createPool() {
  return new Pool({
    user: process.env.user,
    host: process.env.host,
    database: process.env.database,
    password: process.env.password,
    port: process.env.port,
  });
}
