import { DatabaseConnection } from "../db/DatabaseConnection";
import { ServiceCallFallthroughException } from "../errors/ServiceCallFallthroughException";

export class Service<T> {
  protected db: any;

  constructor() {
    this.db = DatabaseConnection.getInstance();
  }

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

  async create(item: T): Promise<T> {
    throw new ServiceCallFallthroughException(
      Object.getPrototypeOf(this).constructor.name,
    );
  }

  async getRelated(parentId: string | number): Promise<T[]> {
    throw new ServiceCallFallthroughException(
      Object.getPrototypeOf(this).constructor.name,
    );
  }
}
