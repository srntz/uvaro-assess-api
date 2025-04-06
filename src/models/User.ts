import { user } from "../db/schemas/index.js";
import { InvalidModelConstructionException } from "../errors/InvalidModelConstructionException.js";

export class User {
  constructor(
    readonly user_id: string,
    readonly email: string,
    readonly first_name: string,
    readonly last_name: string,
  ) {}

  static init(data: typeof user.$inferSelect) {
    try {
      return new User(
        data.user_id,
        data.email,
        data.first_name,
        data.last_name,
      );
    } catch {
      throw new InvalidModelConstructionException(
        Object.getPrototypeOf(this).constructor.name,
      );
    }
  }
}
