import { DatabaseConnection } from "../../db/DatabaseConnection";

export class Repository {
  protected db;

  constructor() {
    this.db = DatabaseConnection.getInstance();
  }
}
