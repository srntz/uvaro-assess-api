import { DatabaseConnection } from "../../db/DatabaseConnection";

/**
 * A parent class of all repositories that unifies the process of accessing the database instance
 */
export class Repository {
  protected db: ReturnType<typeof DatabaseConnection.getInstance>;

  constructor() {
    this.db = DatabaseConnection.getInstance();
  }
}
