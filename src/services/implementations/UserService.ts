import { IUserService } from "../interfaces/IUserService";
import { User } from "../../models/User";
import { IUserRepository } from "../../repositories/interfaces/IUserRepository";
import { IUser } from "../../db/schemas";
import { UserUpdateDTO } from "../../dto/UserUpdateDTO";

export class UserService implements IUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async getById(userId: string): Promise<User> {
    const dbUser = await this.userRepository.getById(userId);
    return dbUser;
  }

  async updateUser(user: UserUpdateDTO): Promise<User> {
    return await this.userRepository.updateUser(user);
  }

  async addUser(user: User): Promise<User> {
    return await this.userRepository.insertUser(user);
  }

  async deleteUser(userId: string): Promise<User> {
    return await this.userRepository.deleteUser(userId);
  }
}
