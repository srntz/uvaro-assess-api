import { Question } from "../../models/Question";

export interface IQuestionRepository {
  /**
   * Retrieves question by the id
   * @param questionId
   * @returns ```Promise<QuestionResponseDTO>``` or ```Promise<null>``` if the question does not exist
   * @throws ```Error``` if the database transaction failed
   */
  getQuestionById(id: number): Promise<Question>;

  /**
   * Retrieves all questions related to the specified category that match the provided isFollowUp option
   * @param categoryId
   * @returns ```Promise<Question[]>```
   * @throws ```Error``` if the database transaction failed
   */
  getQuestionsByCategory(
    categoryId: number,
    isFollowUp: boolean,
  ): Promise<Question[]>;

  /**
   * Retrieves a hashset with ids of all non-follow-up questions from the provided category
   * @param categoryId
   * @returns ```Promise<Set<number>>```
   * @throws ```Error``` if the database transaction failed
   */
  getRequiredQuestionIdsByCategory(categoryId: number): Promise<Set<number>>;
}
