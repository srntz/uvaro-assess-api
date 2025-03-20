import { User } from "../../models/User";
import { user as userTable } from "../../db/schemas";
import { UserUpdateDTO } from "../../dto/UserUpdateDTO";

export interface IUserRepository {
  insertUser(item: User): Promise<User>;
  deleteUser(userId: string): Promise<User>;
  getById(userId: string): Promise<typeof userTable.$inferSelect>;
  updateUser(user: UserUpdateDTO): Promise<typeof userTable.$inferSelect>;
}
