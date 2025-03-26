import { IAnswerRepository } from "../interfaces/IAnswerRepository";
import { Answer } from "../../models/Answer";
import { answer, category, IAnswer, question } from "../../db/schemas";
import { and, eq, or } from "drizzle-orm";
import { Repository } from "../base/Repository";
import { AnswerWithWeightingAndCoefficientDTO } from "../../dto/answer/AnswerWithWeightingAndCoefficientDTO";
import { weighting } from "../../db/schemas/weighting";
import { AnswerWithCategoryIdDTO } from "../../dto/answer/AnswerWithCategoryIdDTO";

export class AnswerRepository extends Repository implements IAnswerRepository {
  constructor() {
    super();
  }

  async getById(id: number): Promise<Answer> {
    const data: (typeof answer.$inferSelect)[] = await this.db
      .select()
      .from(answer)
      .where(eq(answer.answer_id, id));

    if (data.length > 0) {
      return Answer.init(data[0]);
    }

    return null;
  }

  async getByQuestionId(questionId: number): Promise<Answer[]> {
    const relatedAnswers: Answer[] = [];

    const data: (typeof answer.$inferSelect)[] = await this.db
      .select()
      .from(answer)
      .where(eq(answer.question_id, questionId));

    data.forEach((item) => {
      relatedAnswers.push(Answer.init(item));
    });

    return relatedAnswers;
  }

  async getByCategoryId(categoryId: number): Promise<Answer[]> {
    const answers: Answer[] = [];

    const data: {
      answer: typeof answer.$inferSelect;
      question: typeof question.$inferSelect;
    }[] = await this.db
      .select()
      .from(answer)
      .leftJoin(question, eq(answer.question_id, question.question_id))
      .where(eq(question.category_id, categoryId));

    data.forEach((item) => {
      answers.push(Answer.init(item.answer));
    });

    return answers;
  }

  async getAnswersWithWeightingsAndCoefficientsByIds(
    answerIds: number[],
  ): Promise<AnswerWithWeightingAndCoefficientDTO[]> {
    const answers: AnswerWithWeightingAndCoefficientDTO[] = [];

    const data: {
      answer: typeof answer.$inferSelect;
      question: typeof question.$inferSelect;
      weighting: typeof weighting.$inferSelect;
    }[] = await this.db
      .select()
      .from(answer)
      .leftJoin(question, eq(answer.question_id, question.question_id))
      .leftJoin(weighting, eq(answer.weighting_id, weighting.weighting_id))
      .where(
        or(
          ...(() => {
            const whereClauses: ReturnType<typeof eq>[] = [];
            answerIds.forEach((id) => {
              whereClauses.push(eq(answer.answer_id, id));
            });
            return whereClauses;
          })(),
        ),
      );

    data.forEach((item) => {
      answers.push(
        new AnswerWithWeightingAndCoefficientDTO(
          item.answer.answer_id,
          item.weighting.weighting,
          item.question.weighting_coefficient,
          item.answer.question_id,
        ),
      );
    });

    return answers;
  }

  async getAnswersWithCategoryIdsByIds(
    answerIds: number[],
  ): Promise<AnswerWithCategoryIdDTO[]> {
    const answers: AnswerWithCategoryIdDTO[] = [];

    const data: {
      answer: typeof answer.$inferSelect;
      question: typeof question.$inferSelect;
      category: typeof category.$inferSelect;
    }[] = await this.db
      .select()
      .from(answer)
      .leftJoin(question, eq(answer.question_id, question.question_id))
      .leftJoin(category, eq(category.category_id, question.category_id))
      .where(
        or(
          ...(() => {
            const whereClauses: ReturnType<typeof eq>[] = [];

            answerIds.forEach((id) => {
              whereClauses.push(eq(answer.answer_id, id));
            });

            return whereClauses;
          })(),
        ),
      );

    data.forEach((item) => {
      answers.push(
        new AnswerWithCategoryIdDTO(
          item.answer.answer_id,
          item.answer.answer_text,
          item.answer.weighting_id,
          item.answer.question_id,
          item.category.category_id,
        ),
      );
    });

    return answers;
  }
}
