import { Question } from "../../models/Question";
import { QuestionResponseDTO } from "../../dto/question/QuestionResponseDTO";

export interface IQuestionService {
  getFollowupQuestionsByCategory(
    categoryId: number,
  ): Promise<QuestionResponseDTO[]>;
  getQuestionById(id: number): Promise<QuestionResponseDTO>;
  getRegularQuestionsByCategory(
    categoryId: number,
  ): Promise<QuestionResponseDTO[]>;
}
