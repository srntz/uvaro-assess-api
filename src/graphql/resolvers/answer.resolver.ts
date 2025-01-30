import {IAnswer} from "../../db/schemas";
import {QuestionService} from "../../services/QuestionService";

async function questionFieldResolver(question_id: number) {
  const service = new QuestionService();
  return await service.get(question_id);
}

export const answerResolvers = {
  Answer: {
    question: (parent: IAnswer) => questionFieldResolver(parent.question_id)
  }
}
