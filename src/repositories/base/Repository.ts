import { DatabaseConnection } from "../../db/DatabaseConnection";

export class Repository {
  protected db: ReturnType<typeof DatabaseConnection.getInstance>;

  constructor() {
    this.db = DatabaseConnection.getInstance();
  }
}
