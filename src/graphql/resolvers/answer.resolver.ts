import { QuestionService } from "../../services/QuestionService";
import { Answer } from "../../models/Answer";

async function questionFieldResolver(question_id: number) {
  const service = new QuestionService();
  return await service.get(question_id);
}

export const answerResolvers = {
  Answer: {
    question: (parent: Answer) => questionFieldResolver(parent.question_id),
  },
};
