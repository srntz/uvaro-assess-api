import {DatabaseConnection} from "../db/DatabaseConnection";

export class Service<T> {
  protected db: any;

  constructor() {
    this.db = DatabaseConnection.getInstance()
  }

  async get(id: string | number): Promise<T> {
    throw new Error("Method not implemented.");
  }

  async getAll(): Promise<T[]> {
    throw new Error("Method not implemented.");
  }

  async create(item: T): Promise<T> {
    throw new Error("Method not implemented.");
  }

  async getRelated(parentId: string | number): Promise<T[]> {
    throw new Error("Method not implemented.");
  }
}
