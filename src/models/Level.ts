import {ILevel} from "../db/schemas";

export class Level implements ILevel {
  category_id: number;
  level_id: number;
  level_name: string;
  level_statement: string;
  required_weighting: number;

  constructor(levelId: number, levelName: string, levelStatement: string, requiredWeighting: number, categoryId: number) {
    this.category_id = categoryId;
    this.level_id = levelId;
    this.level_name = levelName;
    this.level_statement = levelStatement;
    this.required_weighting = requiredWeighting;
  }
}
