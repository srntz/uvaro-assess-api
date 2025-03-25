import { IAnswerRepository } from "../interfaces/IAnswerRepository";
import { Answer } from "../../models/Answer";
import { answer, IAnswer } from "../../db/schemas";
import { eq } from "drizzle-orm";
import { Repository } from "../base/Repository";

export class AnswerRepository extends Repository implements IAnswerRepository {
  constructor() {
    super();
  }

  async getById(id: number): Promise<Answer> {
    const data: (typeof answer.$inferSelect)[] = await this.db
      .select()
      .from(answer)
      .where(eq(answer.answer_id, id));

    if (data.length > 0) {
      return Answer.init(data[0]);
    }

    return null;
  }

  async getByQuestionId(questionId: number): Promise<Answer[]> {
    const relatedAnswers: Answer[] = [];

    const data: (typeof answer.$inferSelect)[] = await this.db
      .select()
      .from(answer)
      .where(eq(answer.question_id, questionId));

    data.forEach((item) => {
      relatedAnswers.push(Answer.init(item));
    });

    return relatedAnswers;
  }
}
