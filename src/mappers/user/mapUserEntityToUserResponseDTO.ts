import { User } from "../../models/User.js";
import { UserResponseDTO } from "../../dto/user/UserResponseDTO.js";

export function mapUserEntityToUserResponseDTO(user: User) {
  return new UserResponseDTO(user.email, user.first_name, user.last_name);
}
