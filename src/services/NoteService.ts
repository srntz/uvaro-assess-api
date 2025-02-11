import { Note } from "../models/Note";
import { Service } from "./Service";
import { note } from "../db/schemas/note";

export class NoteService extends Service<Note> {
  constructor() {
    super();
  }

  override async create(item: Note): Promise<Note> {
    const res = await this.db.insert(note).values(item).returning();
    return new Note(res[0]);
  }
}
