import { User } from "../../models/User";
import { UserResponseDTO } from "../../dto/user/UserResponseDTO";

export function mapUserEntityToUserResponseDTO(user: User) {
  if (!user) {
    return null;
  }

  return new UserResponseDTO(user.email, user.first_name, user.last_name);
}
