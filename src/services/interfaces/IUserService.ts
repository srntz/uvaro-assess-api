import { UserResponseDTO } from "../../dto/user/UserResponseDTO";

export interface IUserService {
  getById(userId: string): Promise<UserResponseDTO>;
}
