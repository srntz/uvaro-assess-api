import { IUserService } from "../interfaces/IUserService";
import { User } from "../../models/User";
import { IUserRepository } from "../../repositories/interfaces/IUserRepository";

export class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {}

  async addUser(
    firstName: string,
    lastName: string,
    email: string,
  ): Promise<User> {
    const user = new User(firstName, lastName, email);
    return await this.userRepository.insertUser(user);
  }

  async deleteUser(userId: string): Promise<User> {
    return await this.userRepository.deleteUser(userId);
  }
}
