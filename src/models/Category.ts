import { ICategory } from "../db/schemas";
import { BaseModel } from "./BaseModel";
import { InvalidModelConstructionException } from "../errors/InvalidModelConstructionException";

export class Category implements BaseModel<ICategory> {
  readonly category_id: number;
  readonly category_name: string;
  readonly category_description: string;
  readonly category_image: string;

  constructor(data: ICategory) {
    try {
      this.category_id = data.category_id;
      this.category_name = data.category_name;
      this.category_description = data.category_description;
      this.category_image = data.category_image;
    } catch {
      throw new InvalidModelConstructionException(
        Object.getPrototypeOf(this).constructor.name,
      );
    }
  }

  createFullJsonObject(): ICategory {
    return {
      category_id: this.category_id,
      category_name: this.category_name,
      category_description: this.category_description,
      category_image: this.category_image,
    };
  }

  createInsertableJsonObject(): ICategory {
    return {
      category_name: this.category_name,
      category_description: this.category_description,
      category_image: this.category_image,
    };
  }
}
