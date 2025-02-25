import { ILevel } from "../db/schemas";

export class Level {
  // readonly level_id: number | undefined;
  // readonly level_name: string;
  // readonly level_statement: string;
  // readonly required_weighting: number;
  // readonly category_id: number;

  constructor(
    readonly level_name: string,
    readonly level_statement: string,
    readonly required_weighting: number,
    readonly category_id: number,
    readonly level_id?: number,
  ) {}

  static init(data) {
    return new Level(
      data.level_name,
      data.level_statement,
      data.required_weighting,
      data.category_id,
      data.level_id,
    );
  }

  // constructor(data: ILevel) {
  //   try {
  //     this.category_id = data.category_id;
  //     this.level_id = data.level_id;
  //     this.level_name = data.level_name;
  //     this.level_statement = data.level_statement;
  //     this.required_weighting = data.required_weighting;
  //   } catch {
  //     throw new InvalidModelConstructionException(
  //       Object.getPrototypeOf(this).constructor.name,
  //     );
  //   }
  // }
}
