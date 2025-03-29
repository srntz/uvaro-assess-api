import { Answer } from "../../models/Answer";

export interface IAnswerRepository {
  getById(id: number): Promise<Answer>;
  getByQuestionId(questionId: number): Promise<Answer[]>;
}
