import { BaseModel } from "./BaseModel";
import { INote } from "../db/schemas/note";
import { InvalidModelConstructionException } from "../errors/InvalidModelConstructionException";

export class Note implements BaseModel<INote> {
  readonly assessment_id: number;
  readonly category_id: number;
  readonly note_text: string;

  constructor(data: INote) {
    try {
      this.assessment_id = data.assessment_id;
      this.category_id = data.category_id;
      this.note_text = data.note_text;
    } catch {
      throw new InvalidModelConstructionException(
        Object.getPrototypeOf(this).constructor.name,
      );
    }
  }

  createFullJsonObject(): INote {
    return {
      assessment_id: this.assessment_id,
      category_id: this.category_id,
      note_text: this.note_text,
    };
  }

  createInsertableJsonObject(): INote {
    return this.createFullJsonObject();
  }
}
