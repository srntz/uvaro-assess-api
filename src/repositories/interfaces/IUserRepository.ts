import { User } from "../../models/User";
import { UserUpdateDTO } from "../../dto/UserUpdateDTO";

export interface IUserRepository {
  /**
   * Inserts user into the database
   * @param user
   * @returns ```Promise<User>```
   * @throws ```Error``` if the database transaction failed
   */
  insertUser(user: User): Promise<User>;

  /**
   * Deletes a user with the specified userId from the database
   * @param userId
   * @returns ```Promise<User>``` or ```Promise<null>``` if the user does not exist
   * @throws ```Error``` if the database transaction failed
   */
  deleteUser(userId: string): Promise<User>;

  /**
   * Retrieves user data by user id
   * @param userId
   * @returns ```Promise<User>``` or ```Promise<null>``` if the user does not exist
   * @throws ```Error``` if the database transaction failed
   */
  getById(userId: string): Promise<User>;

  /**
   * Updates the user row associated with the provided id.
   * @param user
   * @returns ```Promise<User>```
   * WARNING: The method does not build database queries dymanically. All fields from the argument object are included in the update query.
   */
  updateUser(userId: string, user: UserUpdateDTO): Promise<User>;
}
