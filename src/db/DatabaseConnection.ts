import { drizzle } from "drizzle-orm/node-postgres";
import * as dbSchema from "./schemas/index.js";

export class DatabaseConnection {
  private static instance: ReturnType<typeof drizzle>;

  private constructor() {}

  public static getInstance() {
    if (!this.instance) {
      this.instance = drizzle(process.env.DATABASE_URL as string, {
        schema: dbSchema,
      });
    }
    return this.instance;
  }
}
