import { QuestionResponseDTO } from "../../dto/question/QuestionResponseDTO";

export interface IQuestionService {
  /**
   * Retrieves all follow up questions related to the specified category
   * @param categoryId
   * @returns ```Promise<QuestionResponseDTO[]>```
   */
  getFollowupQuestionsByCategory(
    categoryId: number,
  ): Promise<QuestionResponseDTO[]>;

  /**
   * Retrieves question by the id
   * @param questionId
   * @returns ```Promise<QuestionResponseDTO>``` or ```Promise<null>``` if the question does not exist
   */
  getQuestionById(questionId: number): Promise<QuestionResponseDTO>;

  /**
   * Retrieves non-follow-up questions by the specified categoryId
   * @param categoryId
   * @returns ```Promise<QuestionResponseDTO[]>```
   */
  getRegularQuestionsByCategory(
    categoryId: number,
  ): Promise<QuestionResponseDTO[]>;
}
