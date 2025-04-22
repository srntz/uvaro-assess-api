import { IQuestionService } from "../interfaces/IQuestionService";
import { IQuestionRepository } from "../../repositories/interfaces/IQuestionRepository";
import { QuestionResponseDTO } from "../../dto/question/QuestionResponseDTO";
import { mapQuestionEntityToQuestionResponseDTO } from "../../mappers/question/mapQuestionEntityToQuestionResponseDTO";

export class QuestionService implements IQuestionService {
  constructor(private readonly questionRepository: IQuestionRepository) {}

  async getFollowupQuestionsByCategory(
    categoryId: number,
  ): Promise<QuestionResponseDTO[]> {
    return (
      await this.questionRepository.getQuestionsByCategory(categoryId, true)
    ).map((question) => mapQuestionEntityToQuestionResponseDTO(question));
  }

  async getQuestionById(questionId: number): Promise<QuestionResponseDTO> {
    return mapQuestionEntityToQuestionResponseDTO(
      await this.questionRepository.getQuestionById(questionId),
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
