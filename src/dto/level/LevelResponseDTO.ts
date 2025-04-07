export class LevelResponseDTO {
  constructor(
    readonly levelId: number,
    readonly levelName: string,
    readonly levelStatement: string,
    readonly levelImage: string,
    readonly weightingId: number,
    readonly categoryId: number,
  ) {}
}
