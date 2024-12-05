import {IAnswer} from "../../db/schemas";
import {QuestionService} from "../../services/QuestionService";

async function questionFieldResolver(parent: IAnswer) {
  const service = new QuestionService();
  return await service.get(parent.question_id)
}

export const answerResolvers = {
  Answer: {
    question: (parent: IAnswer) => questionFieldResolver(parent)
  }
}
