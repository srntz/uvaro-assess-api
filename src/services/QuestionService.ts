import {IService} from "../interfaces/IService";
import {Question} from "../models/Question";
import {DatabaseConnection} from "../db/DatabaseConnection";
import {IQuestion, question} from "../db/schemas";
import {eq} from "drizzle-orm";

export class QuestionService implements IService<Question> {
  private db: any;

  constructor() {
    this.db = DatabaseConnection.getInstance()
  }

  async getAll(): Promise<Question[]> {
    throw new Error("Method not implemented.");
  }

  async getRelated(parentId: number): Promise<Question[]> {
    const relatedQuestions: Question[] = []

    const data: IQuestion[] = await this.db.select().from(question).where(eq(question.category_id, parentId));

    data.forEach((item) => {
      const question = new Question(item.question_id, item.question_text, item.category_id);
      relatedQuestions.push(question);
    })

    return relatedQuestions;
  }

  async get(id: number): Promise<Question> {
    const data: IQuestion[] = await this.db.select().from(question).where(eq(question.question_id, id));

    if(data.length > 0) {
      return new Question(data[0].question_id, data[0].question_text, data[0].category_id)
    }

    return null
  }
}
