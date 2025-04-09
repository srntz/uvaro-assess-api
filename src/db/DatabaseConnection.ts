import { drizzle } from "drizzle-orm/node-postgres";
import * as dbSchema from "./schemas/index";
import pg from "pg";

export class DatabaseConnection {
  private static instance: ReturnType<typeof drizzle>;
  private static pool: pg.Pool;

  private constructor() {}

  public static getInstance() {
    if (!this.instance) {
      this.pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
      });
      this.instance = drizzle(this.pool, {
        schema: dbSchema,
      });
    }
    return this.instance;
  }

  public static getPool() {
    if (!this.pool) {
      throw new Error("The pool has not been initialized.");
    }

    return this.pool;
  }
}
