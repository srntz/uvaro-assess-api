import {IService} from "../interfaces/IService";
import {user} from "../db/schemas";
import {DatabaseConnection} from "../db/DatabaseConnection";
import {User} from "../models/User";

export class UserService implements IService<User> {
  private db: any;

  constructor() {
    this.db = DatabaseConnection.getInstance()
  }

  async create(item: User): Promise<User> {
    const insertedItem = await this.db.insert(user).values(item.createInsertableJsonObject()).returning()

    return User.instantiateFromSourceData(insertedItem[0]);
  }

  get(id: number): Promise<User> {
    throw new Error("Method not implemented.");
  }

  getAll(): Promise<User[]> {
    throw new Error("Method not implemented.");
  }
}
