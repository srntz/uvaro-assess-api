import { assessmentAnswer } from "../db/schemas";

export class AssessmentAnswer {
  constructor(
    readonly assessment_id: number,
    readonly question_id: number,
    readonly answer_id: number,
  ) {}

  static init(data: typeof assessmentAnswer.$inferSelect) {
    try {
      return new AssessmentAnswer(
        data.assessment_id,
        data.question_id,
        data.answer_id,
      );
    } catch {
      return null;
    }
  }
}
