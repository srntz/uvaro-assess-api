import { assessmentLevel } from "../db/schemas";

export class AssessmentLevel {
  constructor(
    readonly assessment_id: number,
    readonly category_id: number,
    public level_id?: number,
  ) {}

  static init(data: typeof assessmentLevel.$inferSelect) {
    try {
      return new AssessmentLevel(
        data.assessment_id,
        data.category_id,
        data.level_id,
      );
    } catch {
      return null;
    }
  }
}
