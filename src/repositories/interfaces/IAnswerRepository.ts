import { Answer } from "../../models/Answer";
import { AnswerWithWeightingAndCoefficientDTO } from "../../dto/answer/AnswerWithWeightingAndCoefficientDTO";
import { AnswerWithCategoryIdDTO } from "../../dto/answer/AnswerWithCategoryIdDTO";

export interface IAnswerRepository {
  getById(id: number): Promise<Answer>;
  getByQuestionId(questionId: number): Promise<Answer[]>;
  getByCategoryId(categoryId: number): Promise<Answer[]>;
  getAnswersWithWeightingsAndCoefficientsByIds(
    answerIds: number[],
  ): Promise<AnswerWithWeightingAndCoefficientDTO[]>;
  getAnswersWithCategoryIdsByIds(
    answerIds: number[],
  ): Promise<AnswerWithCategoryIdDTO[]>;
}
