export class LevelWithWeightingDTO {
  constructor(
    readonly level_name: string,
    readonly level_statement: string,
    readonly level_image: string,
    readonly weighting: number,
    readonly weighting_id: number,
    readonly category_id: number,
    readonly level_id: number,
  ) {}
}
