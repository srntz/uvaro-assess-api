import {Answer} from "../models/Answer";
import {answer, IAnswer} from "../db/schemas";
import {eq} from "drizzle-orm";
import {Service} from "./Service";

export class AnswerService extends Service<IAnswer> {
  constructor() {
    super();
  }

  override async get(id: number): Promise<IAnswer> {
    const data: IAnswer[] = await this.db.select().from(answer).where(eq(answer.answer_id, id));

    if(data.length > 0) {
      return new Answer(data[0].answer_id, data[0].answer_text, data[0].weighting, data[0].question_id)
    }

    return null
  }

  override async getRelated(parentId: number): Promise<IAnswer[]> {
    const relatedAnswers: IAnswer[] = [];

    const data: IAnswer[] = await this.db.select().from(answer).where(eq(answer.question_id, parentId));

    data.forEach((item) => {
      relatedAnswers.push(new Answer(item.answer_id, item.answer_text, item.weighting, item.question_id));
    })

    return relatedAnswers
  }

}
