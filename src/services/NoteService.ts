import { Note } from "../models/Note";
import { Service } from "./Service";
import { note } from "../db/schemas/note";
import { eq } from "drizzle-orm";
import { GraphQLError } from "graphql/error";

export class NoteService extends Service<Note> {
  constructor() {
    super();
  }

  override async create(item: Note): Promise<Note> {
    const res = await this.db.insert(note).values(item).returning();
    return new Note(res[0]);
  }

  override async getRelated(parentId: string | number): Promise<Note[]> {
    if (typeof parentId !== "number") {
      throw new GraphQLError("Invalid type");
    }
    const res: Note[] = [];
    const data = await this.db
      .select()
      .from(note)
      .where(eq(note.assessment_id, parentId));

    data.forEach((item) => {
      res.push(new Note(item));
    });

    return res;
  }
}
