import { Answer } from "../../models/Answer";
import { AnswerWithWeightingAndCoefficientDTO } from "../../dto/answer/AnswerWithWeightingAndCoefficientDTO";

export interface IAnswerRepository {
  getById(id: number): Promise<Answer>;
  getByQuestionId(questionId: number): Promise<Answer[]>;
  getByCategoryId(categoryId: number): Promise<Answer[]>;
  getAnswersWithWeightingsAndCoefficientsByIds(
    answerIds: number[],
  ): Promise<AnswerWithWeightingAndCoefficientDTO[]>;
}
