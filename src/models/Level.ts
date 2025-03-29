export class Level {
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
}
