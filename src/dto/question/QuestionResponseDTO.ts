export class QuestionResponseDTO {
  constructor(
    readonly questionId: number,
    readonly categoryId: number,
    readonly questionText: string,
    readonly followUp: boolean,
  ) {}
}
