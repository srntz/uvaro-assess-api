export class AnswerRequestDTO {
  constructor(
    readonly answerId: number,
    readonly questionId?: number,
  ) {}
}
