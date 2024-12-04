import {drizzle} from "drizzle-orm/node-postgres";
import * as dbSchema from './schemas'

export class DatabaseConnection {
  private static instance: any;

  private constructor() {}

  public static getInstance() {
    if(!this.instance) {
      this.instance = drizzle(process.env.UVARO_POSTGRES_URL as string, {
        schema: dbSchema
      });
    }
    return this.instance;
  }
}
