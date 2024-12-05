import {IService} from "../interfaces/IService";
import {Answer} from "../models/Answer";
import {DatabaseConnection} from "../db/DatabaseConnection";
import {answer, IAnswer} from "../db/schemas";
import {eq} from "drizzle-orm";

export class AnswerService implements IService<IAnswer> {
  private db: any;

  constructor() {
    this.db = DatabaseConnection.getInstance()
  }

  getAll(): Promise<IAnswer[]> {
      throw new Error("Method not implemented.");
  }

  async get(id: number): Promise<IAnswer> {
    const data: IAnswer[] = await this.db.select().from(answer).where(eq(answer.answer_id, id));

    if(data.length > 0) {
      return new Answer(data[0].answer_id, data[0].answer_text, data[0].weighting, data[0].question_id)
    }

    return null
  }

  async getRelated(parentId: number): Promise<IAnswer[]> {
    const relatedAnswers: IAnswer[] = [];

    const data: IAnswer[] = await this.db.select().from(answer).where(eq(answer.question_id, parentId));

    data.forEach((item) => {
      relatedAnswers.push(new Answer(item.answer_id, item.answer_text, item.weighting, item.question_id));
    })

    return relatedAnswers
  }

}
