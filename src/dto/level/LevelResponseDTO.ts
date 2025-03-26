export class LevelResponseDTO {
  constructor(
    readonly level_id: number,
    readonly level_name: string,
    readonly level_statement: string,
    readonly required_weighting: number,
    readonly category_id: number,
  ) {}
}
