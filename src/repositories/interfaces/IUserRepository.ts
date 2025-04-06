import { User } from "../../models/User.js";
import { user as userTable } from "../../db/schemas/index.js";
import { UserUpdateDTO } from "../../dto/UserUpdateDTO.js";

export interface IUserRepository {
  insertUser(item: User): Promise<User>;
  deleteUser(userId: string): Promise<User>;
  getById(userId: string): Promise<typeof userTable.$inferSelect>;
  updateUser(user: UserUpdateDTO): Promise<typeof userTable.$inferSelect>;
}
