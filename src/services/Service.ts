import { DatabaseConnection } from "../db/DatabaseConnection";
import { ServiceCallFallthroughException } from "../errors/ServiceCallFallthroughException";

export class Service<T> {
  protected db;

  constructor() {
    this.db = DatabaseConnection.getInstance();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async get(id: string | number): Promise<T> {
    throw new ServiceCallFallthroughException(
      Object.getPrototypeOf(this).constructor.name,
    );
  }

  async getAll(): Promise<T[]> {
    throw new ServiceCallFallthroughException(
      Object.getPrototypeOf(this).constructor.name,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(item: T): Promise<T> {
    throw new ServiceCallFallthroughException(
      Object.getPrototypeOf(this).constructor.name,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getRelated(parentId: string | number): Promise<T[]> {
    throw new ServiceCallFallthroughException(
      Object.getPrototypeOf(this).constructor.name,
    );
  }
}
