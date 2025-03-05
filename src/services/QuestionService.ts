import { Question } from "../models/Question";
import { IQuestion, question } from "../db/schemas";
import { and , eq } from "drizzle-orm";
import { Service } from "./Service";

export class QuestionService extends Service<Question> {
  constructor() {
    super();
  }

  override async getRelated(parentId: number): Promise<Question[]> {
    const relatedQuestions: Question[] = [];

    const data: IQuestion[] = await this.db
      .select()
      .from(question)
      .where(eq(question.category_id, parentId));

    data.forEach((item) => {
      const question = new Question(item);
      relatedQuestions.push(question);
    });

    return relatedQuestions;
  }

  override async get(id: number): Promise<Question> {
    const data: IQuestion[] = await this.db
      .select()
      .from(question)
      .where(eq(question.question_id, id));

    if (data.length > 0) {
      return new Question(data[0]);
    }

    return null;
  }

  async getFollowupQuestionsByCategory(categoryId: number): Promise<Question[]> {
    const followupQuestions: Question[] = [];

    try {
      const data: IQuestion[] = await this.db
        .select()
        .from(question)
        .where(
          and(
            eq(question.category_id, categoryId),
            eq(question.follow_up, true)
          )
        );

      data.forEach((item) => {
        const question = new Question(item);
        followupQuestions.push(question);
      });

      return followupQuestions;
    } catch (error) {
      console.error('Error fetching follow-up questions:', error);
      throw new Error('Failed to fetch follow-up questions');
    }
  }
}
