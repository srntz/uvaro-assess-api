import { Answer } from "../../models/Answer";
import { AnswerWithWeightingAndCoefficientDTO } from "../../dto/answer/AnswerWithWeightingAndCoefficientDTO";
import { AnswerWithCategoryIdDTO } from "../../dto/answer/AnswerWithCategoryIdDTO";

export interface IAnswerRepository {
  /**
   * Retrieves answer by the specified id
   * @param answerId
   * @returns ```Promise<Answer>``` or ```Promise<null>``` if the answer does not exist
   * @throws ```Error``` if the database transaction failed
   */
  getById(id: number): Promise<Answer>;

  /**
   * Retrieves all answers related to the provided questionId
   * @param questionId
   * @returns ```Promise<Answer[]>```
   * @throws ```Error``` if the database transaction failed
   */
  getByQuestionId(questionId: number): Promise<Answer[]>;

  /**
   * Retrieves all answers related to the provided categoryId
   * @param categoryId
   * @returns ```Promise<Answer[]>```
   * @throws ```Error``` if the database transaction failed
   */
  getByCategoryId(categoryId: number): Promise<Answer[]>;

  /**
   * For each answer id from the argument array, retrieves the answer with the corresponding question's weighting and weighting coefficient
   * @param answerIds
   * @returns ```Promise<AnswerWithWeightingAndCoefficientDTO[]>```
   * @throws ```Error``` if the database transaction failed
   */
  getAnswersWithWeightingsAndCoefficientsByIds(
    answerIds: number[],
  ): Promise<AnswerWithWeightingAndCoefficientDTO[]>;

  /**
   * For each answer id from the argument array, retrieves the answer with the corresponding question's category id
   * @param answerIds
   * @returns ```Promise<AnswerWithCategoryIdDTO>```
   * @throws ```Error``` if the database transaction failed
   */
  getAnswersWithCategoryIdsByIds(
    answerIds: number[],
  ): Promise<AnswerWithCategoryIdDTO[]>;
}
