import { BaseModel } from "./BaseModel";
import { IUser } from "../db/schemas";
import { InvalidModelConstructionException } from "../errors/InvalidModelConstructionException";

export class User {
  // readonly user_id: string | undefined;
  // readonly first_name: string;
  // readonly last_name: string;
  // readonly email: string;

  constructor(
    readonly first_name: string,
    readonly last_name: string,
    readonly email: string,
    readonly user_id?: string,
  ) {}

  static init(data) {
    return new User(data.first_name, data.last_name, data.email, data.user_id);
  }

  // createInsertableJsonObject() {
  //   return {
  //     first_name: this.first_name,
  //     last_name: this.last_name,
  //     email: this.email,
  //   };
  // }
  //
  // createFullJsonObject() {
  //   return {
  //     user_id: this.user_id,
  //     first_name: this.first_name,
  //     last_name: this.last_name,
  //     email: this.email,
  //   };
  // }
}
