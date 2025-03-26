export class AnswerWithCategoryIdDTO {
  constructor(
    readonly answer_id: number,
    readonly answer_text: string,
    readonly weighting_id: number,
    readonly question_id: number,
    readonly category_id: number,
  ) {}
}
