import { IAnswerService } from "../interfaces/IAnswerService";
import { IAnswerRepository } from "../../repositories/interfaces/IAnswerRepository";
import { AnswerResponseDTO } from "../../dto/answer/AnswerResponseDTO";
import { mapAnswerEntityToAnswerResponseDTO } from "../../mappers/answer/mapAnswerEntityToAnswerResponseDTO";

export class AnswerService implements IAnswerService {
  constructor(private readonly answerRepository: IAnswerRepository) {}

  async getById(answerId: number): Promise<AnswerResponseDTO | null> {
    return mapAnswerEntityToAnswerResponseDTO(
      await this.answerRepository.getById(answerId),
    );
  }

  async getByQuestionId(questionId: number): Promise<AnswerResponseDTO[]> {
    return (await this.answerRepository.getByQuestionId(questionId)).map(
      (answer) => mapAnswerEntityToAnswerResponseDTO(answer),
    );
  }
}
