import { note } from "../db/schemas";

export class Note {
  constructor(
    readonly note_text: string,
    readonly assessment_id: number,
    readonly category_id: number,
  ) {}

  static init(data: typeof note.$inferSelect) {
    try {
      return new Note(data.note_text, data.assessment_id, data.category_id);
    } catch {
      return null;
    }
  }
}
