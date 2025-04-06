import { Question } from "../../models/Question.js";

export interface IQuestionRepository {
  getQuestionById(id: number): Promise<Question>;
  getQuestionsByCategory(
    categoryId: number,
    isFollowUp: boolean,
  ): Promise<Question[]>;
  getRequiredQuestionIdsByCategory(categoryId: number): Promise<Set<number>>;
}
