export class AnswerInsertDTO {
  constructor(
    readonly questionId: number,
    readonly answerId: number,
  ) {}

  static fromInput(data) {
    return new AnswerInsertDTO(data.question_id, data.answer_id);
  }
}
