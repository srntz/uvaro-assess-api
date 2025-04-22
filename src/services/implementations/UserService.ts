import { IUserService } from "../interfaces/IUserService";
import { IUserRepository } from "../../repositories/interfaces/IUserRepository";
import { UserResponseDTO } from "../../dto/user/UserResponseDTO";
import { mapUserEntityToUserResponseDTO } from "../../mappers/user/mapUserEntityToUserResponseDTO";

export class UserService implements IUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async getById(userId: string): Promise<UserResponseDTO | null> {
    return mapUserEntityToUserResponseDTO(
      await this.userRepository.getById(userId),
    );
  }
}
