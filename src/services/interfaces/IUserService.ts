import { UserResponseDTO } from "../../dto/user/UserResponseDTO";

export interface IUserService {
  /**
   * Retrieves user data by user id
   * @param userId
   * @returns ```Promise<UserResponseDTO>``` or ```Promise<null>``` if the user does not exist
   */
  getById(userId: string): Promise<UserResponseDTO | null>;
}
