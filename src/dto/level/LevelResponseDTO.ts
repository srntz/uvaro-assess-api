export class LevelResponseDTO {
  constructor(
    readonly levelId: number,
    readonly levelName: string,
    readonly levelStatement: string,
    readonly weightingId: number,
    readonly categoryId: number,
  ) {}
}
