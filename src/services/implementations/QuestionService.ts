import { IQuestionService } from "../interfaces/IQuestionService";
import { Question } from "../../models/Question";
import { IQuestionRepository } from "../../repositories/interfaces/IQuestionRepository";

export class QuestionService implements IQuestionService {
  constructor(private readonly questionRepository: IQuestionRepository) {}

  async getFollowupQuestionsByCategory(
    categoryId: number,
  ): Promise<Question[]> {
    return await this.questionRepository.getQuestionsByCategory(
      categoryId,
      true,
    );
  }

  async getQuestionById(id: number): Promise<Question> {
    return await this.questionRepository.getQuestionById(id);
  }

  async getRegularQuestionsByCategory(categoryId: number): Promise<Question[]> {
    return await this.questionRepository.getQuestionsByCategory(
      categoryId,
      false,
    );
  }
}
