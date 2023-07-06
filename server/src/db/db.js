import { createPool } from "mysql2/promise";
import { config } from "dotenv";
config();

export const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: "",
  database: process.env.DB,
  port: 3306,
});
