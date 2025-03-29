export class AssessmentAnswerInsertDTO {
  constructor(
    readonly assessmentId: number,
    readonly questionId: number,
    readonly answerId: number,
  ) {}
}
