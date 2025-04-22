import { AnswerResponseDTO } from "../../dto/answer/AnswerResponseDTO";

export interface IAnswerService {
  /**
   * Retrieves answer by the specified id
   * @param answerId
   * @returns ```Promise<AnswerResponseDTO>``` or ```Promise<null>``` if the answer does not exist
   */
  getById(answerId: number): Promise<AnswerResponseDTO>;

  /**
   * Retrieves all answers related to the specified question
   * @param questionId
   * @returns ```Promise<AnswerResponseDTO[]>```
   */
  getByQuestionId(questionId: number): Promise<AnswerResponseDTO[]>;
}
