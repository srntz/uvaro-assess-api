import { Repository } from "../base/Repository.js";
import { IUserRepository } from "../interfaces/IUserRepository.js";
import { User } from "../../models/User.js";
import { user as userTable } from "../../db/schemas/index.js";
import { eq } from "drizzle-orm";
import { UserUpdateDTO } from "../../dto/UserUpdateDTO.js";

export class UserRepository extends Repository implements IUserRepository {
  constructor() {
    super();
  }

  async getById(userId: string): Promise<typeof userTable.$inferSelect> {
    const data: (typeof userTable.$inferSelect)[] = await this.db
      .select()
      .from(userTable)
      .where(eq(userTable.user_id, userId));

    return data[0];
  }

  async updateUser(
    user: UserUpdateDTO,
  ): Promise<typeof userTable.$inferSelect> {
    const data: (typeof userTable.$inferSelect)[] = await this.db
      .update(userTable)
      .set({
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.email,
      })
      .where(eq(userTable.user_id, user.id))
      .returning();

    return data[0];
  }

  async insertUser(item: User): Promise<User> {
    const data: (typeof userTable.$inferSelect)[] = await this.db
      .insert(userTable)
      .values(item)
      .returning();

    return User.init(data[0]);
  }

  async deleteUser(userId: string): Promise<User> {
    const data: (typeof userTable.$inferSelect)[] = await this.db
      .delete(userTable)
      .where(eq(userTable.user_id, userId))
      .returning();

    return User.init(data[0]);
  }
}
