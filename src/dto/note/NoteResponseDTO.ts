export class NoteResponseDTO {
  constructor(
    readonly noteText: string,
    readonly assessmentId: number,
    readonly categoryId: number,
  ) {}
}
