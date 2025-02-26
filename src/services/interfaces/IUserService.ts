import { User } from "../../models/User";

export interface IUserService {
  addUser(firstName: string, lastName: string, email: string): Promise<User>;
  deleteUser(userId: string): Promise<User>;
}
