import { Answer } from "../../models/Answer";
import { AnswerResponseDTO } from "../../dto/answer/AnswerResponseDTO";

export interface IAnswerService {
  getById(id: number): Promise<AnswerResponseDTO>;
  getByQuestionId(questionId: number): Promise<AnswerResponseDTO[]>;
}
