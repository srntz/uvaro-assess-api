import { UserResponseDTO } from "../../dto/user/UserResponseDTO.js";

export interface IUserService {
  getById(userId: string): Promise<UserResponseDTO>;
}
