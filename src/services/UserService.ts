import {IService} from "../interfaces/IService";
import {IUser, IUserInsert, user} from "../db/schemas";
import {DatabaseConnection} from "../db/DatabaseConnection";

export class UserService implements IService<IUser, IUserInsert> {
  private db: any;

  constructor() {
    this.db = DatabaseConnection.getInstance()
  }

  async create(item: IUserInsert): Promise<IUser> {
    const insertedItem = await this.db.insert(user).values({
      first_name: item.first_name,
      last_name: item.last_name,
      email: item.email
    }).returning()

    return insertedItem[0]
  }

  get(id: number): Promise<IUser> {
    throw new Error("Method not implemented.");
  }

  getAll(): Promise<IUser[]> {
    throw new Error("Method not implemented.");
  }
}
