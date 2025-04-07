export class AssessmentResponseDTO {
  constructor(
    readonly assessmentId: number,
    readonly startDateTime: Date,
    readonly endDateTime: Date,
    readonly userId: string,
  ) {}
}
