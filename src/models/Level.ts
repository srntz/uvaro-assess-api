import { level } from "../db/schemas/index.js";

export class Level {
  constructor(
    readonly level_name: string,
    readonly level_statement: string,
    readonly weighting_id: number,
    readonly category_id: number,
    readonly level_id: number,
  ) {}

  static init(data: typeof level.$inferSelect) {
    return new Level(
      data.level_name,
      data.level_statement,
      data.weighting_id,
      data.category_id,
      data.level_id,
    );
  }
}
