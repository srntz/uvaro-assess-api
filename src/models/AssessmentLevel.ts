export class AssessmentLevel {
  constructor(
    readonly assessment_id: number,
    readonly category_id: number,
    public level_id?: number,
  ) {}

  static init(data) {
    return new AssessmentLevel(
      data.assessment_id,
      data.category_id,
      data.level_id,
    );
  }
}
