import { IAnswerService } from "../interfaces/IAnswerService";
import { Answer } from "../../models/Answer";
import { IAnswerRepository } from "../../repositories/interfaces/IAnswerRepository";

export class AnswerService implements IAnswerService {
  constructor(private readonly answerRepository: IAnswerRepository) {}

  async getById(id: number): Promise<Answer> {
    return await this.answerRepository.getById(id);
  }

  async getByQuestionId(questionId: number): Promise<Answer[]> {
    return await this.answerRepository.getByQuestionId(questionId);
  }
}
