import { answer } from "../db/schemas/index.js";
import { InvalidModelConstructionException } from "../errors/InvalidModelConstructionException.js";

export class Answer {
  constructor(
    readonly answer_id: number,
    readonly answer_text: string,
    readonly weighting_id: number,
    readonly question_id: number,
  ) {}

  static init(data: typeof answer.$inferSelect) {
    try {
      return new Answer(
        data.answer_id,
        data.answer_text,
        data.weighting_id,
        data.question_id,
      );
    } catch {
      throw new InvalidModelConstructionException(
        Object.getPrototypeOf(this).constructor.name,
      );
    }
  }
}
