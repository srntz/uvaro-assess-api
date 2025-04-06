import { IQuestionService } from "../interfaces/IQuestionService.js";
import { IQuestionRepository } from "../../repositories/interfaces/IQuestionRepository.js";
import { QuestionResponseDTO } from "../../dto/question/QuestionResponseDTO.js";
import { mapQuestionEntityToQuestionResponseDTO } from "../../mappers/question/mapQuestionEntityToQuestionResponseDTO.js";

export class QuestionService implements IQuestionService {
  constructor(private readonly questionRepository: IQuestionRepository) {}

  async getFollowupQuestionsByCategory(
    categoryId: number,
  ): Promise<QuestionResponseDTO[]> {
    return (
      await this.questionRepository.getQuestionsByCategory(categoryId, true)
    ).map((question) => mapQuestionEntityToQuestionResponseDTO(question));
  }

  async getQuestionById(id: number): Promise<QuestionResponseDTO> {
    return mapQuestionEntityToQuestionResponseDTO(
      await this.questionRepository.getQuestionById(id),
    );
  }

  async getRegularQuestionsByCategory(
    categoryId: number,
  ): Promise<QuestionResponseDTO[]> {
    return (
      await this.questionRepository.getQuestionsByCategory(categoryId, false)
    ).map((question) => mapQuestionEntityToQuestionResponseDTO(question));
  }
}
