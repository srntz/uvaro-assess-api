import { IQuestionRepository } from "../../repositories/interfaces/IQuestionRepository";
import { Question } from "../../models/Question";

export class MockQuestionRepository implements IQuestionRepository {
  readonly storage = new Map<number, Question>([
    [
      1,
      new Question(
        1,      // question_id
        1,      // category_id
        "What is your experience level?", // question_text
        0.8,    // weighting_coefficient
        false   // follow_up
      )
    ],
    [
      2,
      new Question(
        2,
        1,
        "Can you provide more details?",
        0.5,
        true
      )
    ],
    [
      3,
      new Question(
        3,
        2,
        "Describe your technical skills",
        1.0,
        false
      )
    ]
  ]);

  async getQuestionById(id: number): Promise<Question> {
    return this.storage.get(id) || null;
  }

  async getQuestionsByCategory(
    categoryId: number,
    isFollowUp: boolean
  ): Promise<Question[]> {
    return Array.from(this.storage.values()).filter(
      q => q.category_id === categoryId && q.follow_up === isFollowUp
    );
  }

  async getRequiredQuestionIdsByCategory(categoryId: number): Promise<Set<number>> {
    const questions = await this.getQuestionsByCategory(categoryId, false);
    return new Set(questions.map(q => q.question_id));
  }
}