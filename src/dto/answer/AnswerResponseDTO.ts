export class AnswerResponseDTO {
  constructor(
    readonly answerId: number,
    readonly answerText: string,
    readonly weightingId: number,
    readonly questionId: number,
  ) {}
}
