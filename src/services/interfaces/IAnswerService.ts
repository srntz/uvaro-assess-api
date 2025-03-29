import { Answer } from "../../models/Answer";

export interface IAnswerService {
  getById(id: number): Promise<Answer>;
  getByQuestionId(questionId: number): Promise<Answer[]>;
}
