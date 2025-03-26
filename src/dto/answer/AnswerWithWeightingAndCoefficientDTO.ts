export class AnswerWithWeightingAndCoefficientDTO {
  constructor(
    readonly answer_id: number,
    readonly weighting: number,
    readonly weighting_coefficient: number,
    readonly question_id: number,
  ) {}
}
