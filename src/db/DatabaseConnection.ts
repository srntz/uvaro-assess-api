import {drizzle} from "drizzle-orm/node-postgres";

export class DatabaseConnection {
  private static instance: any;

  private constructor() {}

  public static getInstance() {
    console.log(process.env.UVARO_POSTGRES_URL);
    if(!this.instance) {
      this.instance = drizzle(process.env.UVARO_POSTGRES_URL as string);
    }
    return this.instance;
  }
}
