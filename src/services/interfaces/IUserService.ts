import { User } from "../../models/User";
import { UserUpdateDTO } from "../../dto/UserUpdateDTO";

export interface IUserService {
  addUser(user: User): Promise<User>;
  deleteUser(userId: string): Promise<User>;
  getById(userId: string): Promise<User>;
  updateUser(user: UserUpdateDTO): Promise<User>;
}
