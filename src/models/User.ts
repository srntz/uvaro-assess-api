import {BaseModel} from "./BaseModel";
import {IUser} from "../db/schemas";
import {InvalidModelConstructionException} from "../errors/InvalidModelConstructionException";

export class User implements BaseModel<IUser> {
    private user_id: string | undefined;
    private first_name: string;
    private last_name: string;
    private email: string;

    constructor(data: IUser) {
      try {
        this.user_id = data.user_id;
        this.first_name = data.first_name;
        this.last_name = data.last_name;
        this.email = data.email
      } catch (e) {
        throw new InvalidModelConstructionException(Object.getPrototypeOf(this).constructor.name)
      }
    }

    createInsertableJsonObject() {
      return {
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email,
      }
    }

  createFullJsonObject() {
      return {
        user_id: this.user_id,
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email,
      }
  }

}
