import { IAnswerRepository } from "../../repositories/interfaces/IAnswerRepository";
import { Answer } from "../../models/Answer";
import { AnswerWithWeightingAndCoefficientDTO } from "../../dto/answer/AnswerWithWeightingAndCoefficientDTO";
import { AnswerWithCategoryIdDTO } from "../../dto/answer/AnswerWithCategoryIdDTO";

export class MockAnswerRepository implements IAnswerRepository {
  readonly storage = new Map<number, Answer>([
    [1, new Answer(1, "Answer 1", 1, 1)],
    [2, new Answer(2, "Answer 2", 1, 1)],
    [3, new Answer(3, "Answer 3", 2, 2)],
  ]);

  private questionToCategoryMap = new Map<number, number>([
    [1, 1], // questionId 1 belongs to categoryId 1
    [2, 1], // questionId 2 belongs to categoryId 1
  ]);

  async getById(id: number): Promise<Answer> {
    return this.storage.get(id) || null;
  }

  async getByQuestionId(questionId: number): Promise<Answer[]> {
    return Array.from(this.storage.values()).filter(
      answer => answer.question_id === questionId
    );
  }

  async getByCategoryId(categoryId: number): Promise<Answer[]> {
    // get all question IDs for this category
    const questionIds = Array.from(this.questionToCategoryMap.entries())
      .filter(([_, catId]) => catId === categoryId)
      .map(([qId, _]) => qId);

    // get all answers for these questions
    return Array.from(this.storage.values()).filter(
      answer => questionIds.includes(answer.question_id)
    );
  }

  async getAnswersWithWeightingsAndCoefficientsByIds(
    answerIds: number[]
  ): Promise<AnswerWithWeightingAndCoefficientDTO[]> {
    return answerIds.map(id => {
      const answer = this.storage.get(id);
      if (!answer) return null;
      
      return {
        answer_id: answer.answer_id,
        answer_text: answer.answer_text,
        weighting_id: answer.weighting_id,
        question_id: answer.question_id,
        weighting: 0.5, // mock value
        weighting_coefficient: 1.0 // mock value
      };
    }).filter(Boolean) as AnswerWithWeightingAndCoefficientDTO[];
  }

  async getAnswersWithCategoryIdsByIds(
    answerIds: number[]
  ): Promise<AnswerWithCategoryIdDTO[]> {
    return answerIds.map(id => {
      const answer = this.storage.get(id);
      if (!answer) return null;
      
      const categoryId = this.questionToCategoryMap.get(answer.question_id) || 0;
      
      return {
        answer_id: answer.answer_id,
        answer_text: answer.answer_text,
        category_id: categoryId
      };
    }).filter(Boolean) as AnswerWithCategoryIdDTO[];
  }
}