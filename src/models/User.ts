import { BaseModel } from "./BaseModel";
import { IUser } from "../db/schemas";
import { InvalidModelConstructionException } from "../errors/InvalidModelConstructionException";

export class User {
  constructor(
    readonly first_name: string,
    readonly last_name: string,
    readonly email: string,
    readonly user_id?: string,
  ) {}

  static init(data) {
    return new User(data.first_name, data.last_name, data.email, data.user_id);
  }
}
