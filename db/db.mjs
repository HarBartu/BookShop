import pg from "pg";
const { Pool } = pg;
export function createPool() {
  return new Pool({
    user: "postgres",
    host: "localhost",
    database: "saitynai",
    password: "root",
    port: 5432,
  });
}
