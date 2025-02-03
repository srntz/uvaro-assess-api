import {ILevel} from "../db/schemas";
import {BaseModel} from "./BaseModel";
import {InvalidModelConstructionException} from "../errors/InvalidModelConstructionException";

export class Level implements BaseModel<ILevel> {
  readonly level_id: number | undefined;
  readonly level_name: string;
  readonly level_statement: string;
  readonly required_weighting: number;
  readonly category_id: number;

  constructor(data: ILevel) {
    try {
      this.category_id = data.category_id;
      this.level_id = data.level_id;
      this.level_name = data.level_name;
      this.level_statement = data.level_statement;
      this.required_weighting = data.required_weighting;
    } catch (e) {
      throw new InvalidModelConstructionException(Object.getPrototypeOf(this).constructor.name)
    }
  }

  createFullJsonObject(): ILevel {
    return {
      level_id: this.level_id,
      level_name: this.level_name,
      level_statement: this.level_statement,
      required_weighting: this.required_weighting,
      category_id: this.category_id,
    };
  }

  createInsertableJsonObject(): ILevel {
    return {
      level_name: this.level_name,
      level_statement: this.level_statement,
      required_weighting: this.required_weighting,
      category_id: this.category_id,
    };
  }
}
