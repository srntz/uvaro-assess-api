import {ICategory} from "../db/schemas";
import {BaseModel} from "./BaseModel";
import {InvalidModelConstructionException} from "../errors/InvalidModelConstructionException";

export class Category implements BaseModel<ICategory> {
    readonly category_id: number;
    readonly category_name: string;

    constructor(data: ICategory) {
      try {
        this.category_id = data.category_id;
        this.category_name = data.category_name;
      } catch (e) {
        throw new InvalidModelConstructionException(Object.getPrototypeOf(this).constructor.name)
      }
    }

  createFullJsonObject(): ICategory {
    return {
      category_id: this.category_id,
      category_name: this.category_name,
    };
  }

  createInsertableJsonObject(): ICategory {
    return {
      category_name: this.category_name,
    };
  }

}
