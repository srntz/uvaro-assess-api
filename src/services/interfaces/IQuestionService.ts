import { Question } from "../../models/Question";

export interface IQuestionService {
  getFollowupQuestionsByCategory(categoryId: number): Promise<Question[]>;
  getQuestionById(id: number): Promise<Question>;
  getRegularQuestionsByCategory(categoryId: number): Promise<Question[]>;
}
