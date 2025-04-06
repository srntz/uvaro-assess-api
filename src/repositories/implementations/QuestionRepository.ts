import { IQuestionRepository } from "../interfaces/IQuestionRepository.js";
import { Question } from "../../models/Question.js";
import { Repository } from "../base/Repository.js";
import { question } from "../../db/schemas/index.js";
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
      questions.push(Question.init(item));
    });

    return questions;
  }

  async getQuestionById(id: number): Promise<Question> {
    const data: (typeof question.$inferSelect)[] = await this.db
      .select()
      .from(question)
      .where(eq(question.question_id, id));

    if (data.length > 0) {
      return Question.init(data[0]);
    }

    return null;
  }

  async getRequiredQuestionIdsByCategory(
    categoryId: number,
  ): Promise<Set<number>> {
    const data: { question_id: typeof question.$inferSelect.question_id }[] =
      await this.db
        .select({ question_id: question.question_id })
        .from(question)
        .where(
          and(
            eq(question.category_id, categoryId),
            eq(question.follow_up, false),
          ),
        );

    return new Set<number>(data.map((item) => item.question_id));
  }
}
