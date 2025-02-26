import { Repository } from "../base/Repository";
import { IUserRepository } from "../interfaces/IUserRepository";
import { User } from "../../models/User";
import { user } from "../../db/schemas";
import { eq } from "drizzle-orm";

export class UserRepository extends Repository implements IUserRepository {
  constructor() {
    super();
  }

  async insertUser(item: User): Promise<User> {
    const data = await this.db.insert(user).values(item).returning();

    return User.init(data[0]);
  }

  async deleteUser(userId: string): Promise<User> {
    const data = await this.db
      .delete(user)
      .where(eq(user.user_id, userId))
      .returning();

    return User.init(data[0]);
  }
}
