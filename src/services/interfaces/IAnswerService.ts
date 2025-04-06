import { AnswerResponseDTO } from "../../dto/answer/AnswerResponseDTO.js";

export interface IAnswerService {
  getById(id: number): Promise<AnswerResponseDTO>;
  getByQuestionId(questionId: number): Promise<AnswerResponseDTO[]>;
}
