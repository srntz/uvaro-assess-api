import { Answer } from "../models/Answer";
import { answer, IAnswer } from "../db/schemas";
import { eq } from "drizzle-orm";
import { Service } from "./Service";

export class AnswerService extends Service<Answer> {
  constructor() {
    super();
  }

  override async get(id: number): Promise<Answer> {
    const data: IAnswer[] = await this.db
      .select()
      .from(answer)
      .where(eq(answer.answer_id, id));

    if (data.length > 0) {
      return new Answer(data[0]);
    }

    return null;
  }

  override async getRelated(parentId: number): Promise<Answer[]> {
    const relatedAnswers: Answer[] = [];

    const data: IAnswer[] = await this.db
      .select()
      .from(answer)
      .where(eq(answer.question_id, parentId));

    data.forEach((item) => {
      relatedAnswers.push(new Answer(item));
    });

    return relatedAnswers;
  }
}
