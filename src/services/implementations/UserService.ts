import { IUserService } from "../interfaces/IUserService.js";
import { IUserRepository } from "../../repositories/interfaces/IUserRepository.js";
import { UserResponseDTO } from "../../dto/user/UserResponseDTO.js";
import { mapUserEntityToUserResponseDTO } from "../../mappers/user/mapUserEntityToUserResponseDTO.js";

export class UserService implements IUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async getById(userId: string): Promise<UserResponseDTO> {
    return mapUserEntityToUserResponseDTO(
      await this.userRepository.getById(userId),
    );
  }
}
