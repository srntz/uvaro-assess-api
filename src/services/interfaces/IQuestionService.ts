import { QuestionResponseDTO } from "../../dto/question/QuestionResponseDTO.js";

export interface IQuestionService {
  getFollowupQuestionsByCategory(
    categoryId: number,
  ): Promise<QuestionResponseDTO[]>;
  getQuestionById(id: number): Promise<QuestionResponseDTO>;
  getRegularQuestionsByCategory(
    categoryId: number,
  ): Promise<QuestionResponseDTO[]>;
}
