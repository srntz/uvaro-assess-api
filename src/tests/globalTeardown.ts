import { DatabaseConnection } from "../db/DatabaseConnection";

export default async function () {
  const pool = DatabaseConnection.getPool();
  if (pool) {
    await pool.end();
  }
}
