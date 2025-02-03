import { user } from "../db/schemas";
import { User } from "../models/User";
import { Service } from "./Service";

export class UserService extends Service<User> {
  constructor() {
    super();
  }

  override async create(item: User): Promise<User> {
    const insertedItem = await this.db
      .insert(user)
      .values(item.createInsertableJsonObject())
      .returning();

    return new User(insertedItem[0]);
  }
}
