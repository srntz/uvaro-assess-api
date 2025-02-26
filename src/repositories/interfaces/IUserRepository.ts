import { User } from "../../models/User";

export interface IUserRepository {
  insertUser(item: User): Promise<User>;
  deleteUser(userId: string): Promise<User>;
}
