import { question } from "../db/schemas";
import { InvalidModelConstructionException } from "../errors/InvalidModelConstructionException";

export class Question {
  constructor(
    readonly question_id: number,
    readonly category_id: number,
    readonly question_text: string,
    readonly follow_up: boolean,
  ) {}

  static fromDatabase(data: typeof question.$inferSelect) {
    try {
      return new Question(
        data.question_id,
        data.category_id,
        data.question_text,
        data.follow_up,
      );
    } catch {
      throw new InvalidModelConstructionException(
        Object.getPrototypeOf(this).constructor.name,
      );
    }
  }
}
