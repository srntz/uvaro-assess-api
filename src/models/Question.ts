import { question } from "../db/schemas";

export class Question {
  constructor(
    readonly question_id: number,
    readonly category_id: number,
    readonly question_text: string,
    readonly weighting_coefficient: number,
    readonly follow_up: boolean,
  ) {}

  static init(data: typeof question.$inferSelect) {
    try {
      return new Question(
        data.question_id,
        data.category_id,
        data.question_text,
        data.weighting_coefficient,
        data.follow_up,
      );
    } catch {
      return null;
    }
  }
}
