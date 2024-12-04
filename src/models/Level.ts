import {ILevel} from "../db/schemas";

export class Level implements ILevel {
  category_id: number;
  level_id: number;
  level_name: string;
  level_statement: string;
  required_weighting: number;
}
