import {Question} from "../models/Question";
import {IQuestion, question} from "../db/schemas";
import {eq} from "drizzle-orm";
import {Service} from "./Service";

export class QuestionService extends Service<Question> {
  constructor() {
    super();
  }

  override async getRelated(parentId: number): Promise<Question[]> {
    const relatedQuestions: Question[] = []

    const data: IQuestion[] = await this.db.select().from(question).where(eq(question.category_id, parentId));

    data.forEach((item) => {
      const question = new Question(item);
      relatedQuestions.push(question);
    })

    return relatedQuestions;
  }

  override async get(id: number): Promise<Question> {
    const data: IQuestion[] = await this.db.select().from(question).where(eq(question.question_id, id));

    if(data.length > 0) {
      return new Question(data[0])
    }

    return null
  }
}
