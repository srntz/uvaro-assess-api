import { IQuestionRepository } from "../interfaces/IQuestionRepository";
import { Question } from "../../models/Question";
import { Repository } from "../base/Repository";
import { question } from "../../db/schemas";
import { and, eq } from "drizzle-orm";

export class QuestionRepository
  extends Repository
  implements IQuestionRepository
{
  constructor() {
    super();
  }

  async getQuestionsByCategory(
    categoryId: number,
    isFollowUp: boolean,
  ): Promise<Question[]> {
    const questions: Question[] = [];

    const data: (typeof question.$inferSelect)[] = await this.db
      .select()
      .from(question)
      .where(
        and(
          eq(question.category_id, categoryId),
          eq(question.follow_up, isFollowUp),
        ),
      );

    data.forEach((item) => {
      questions.push(Question.fromDatabase(item));
    });

    return questions;
  }

  async getQuestionById(id: number): Promise<Question> {
    const data: (typeof question.$inferSelect)[] = await this.db
      .select()
      .from(question)
      .where(eq(question.question_id, id));

    if (data.length > 0) {
      return Question.fromDatabase(data[0]);
    }

    return null;
  }
}
