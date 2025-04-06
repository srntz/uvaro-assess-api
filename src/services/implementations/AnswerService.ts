import { IAnswerService } from "../interfaces/IAnswerService.js";
import { IAnswerRepository } from "../../repositories/interfaces/IAnswerRepository.js";
import { AnswerResponseDTO } from "../../dto/answer/AnswerResponseDTO.js";
import { mapAnswerEntityToAnswerResponseDTO } from "../../mappers/answer/mapAnswerEntityToAnswerResponseDTO.js";

export class AnswerService implements IAnswerService {
  constructor(private readonly answerRepository: IAnswerRepository) {}

  async getById(id: number): Promise<AnswerResponseDTO> {
    return mapAnswerEntityToAnswerResponseDTO(
      await this.answerRepository.getById(id),
    );
  }

  async getByQuestionId(questionId: number): Promise<AnswerResponseDTO[]> {
    return (await this.answerRepository.getByQuestionId(questionId)).map(
      (answer) => mapAnswerEntityToAnswerResponseDTO(answer),
    );
  }
}
