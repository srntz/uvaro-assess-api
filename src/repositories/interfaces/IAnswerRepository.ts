import { Answer } from "../../models/Answer.js";
import { AnswerWithWeightingAndCoefficientDTO } from "../../dto/answer/AnswerWithWeightingAndCoefficientDTO.js";
import { AnswerWithCategoryIdDTO } from "../../dto/answer/AnswerWithCategoryIdDTO.js";

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
