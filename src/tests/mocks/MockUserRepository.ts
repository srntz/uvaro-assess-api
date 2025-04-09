import { IUserRepository } from "../../repositories/interfaces/IUserRepository";
import { User } from "../../models/User";
import { user as userTable } from "../../db/schemas";
import { UserUpdateDTO } from "../../dto/UserUpdateDTO";

export class MockUserRepository implements IUserRepository {
  readonly storage = new Map<string, User>([
    [
      "user1", 
      new User(
        "user1",
        "user1@example.com",
        "John",
        "Doe"
      )
    ],
    [
      "user2",
      new User(
        "user2",
        "user2@example.com",
        "Jane",
        "Smith"
      )
    ]
  ]);

  async getById(userId: string): Promise<typeof userTable.$inferSelect> {
    const user = this.storage.get(userId);
    return user ? {
      user_id: user.user_id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name
    } : null;
  }
}