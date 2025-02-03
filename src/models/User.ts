import { BaseModel } from "./BaseModel";
import { IUser } from "../db/schemas";
import { InvalidModelConstructionException } from "../errors/InvalidModelConstructionException";

export class User implements BaseModel<IUser> {
  readonly user_id: string | undefined;
  readonly first_name: string;
  readonly last_name: string;
  readonly email: string;

  constructor(data: IUser) {
    try {
      this.user_id = data.user_id;
      this.first_name = data.first_name;
      this.last_name = data.last_name;
      this.email = data.email;
    } catch {
      throw new InvalidModelConstructionException(
        Object.getPrototypeOf(this).constructor.name,
      );
    }
  }

  createInsertableJsonObject() {
    return {
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
    };
  }

  createFullJsonObject() {
    return {
      user_id: this.user_id,
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
    };
  }
}
