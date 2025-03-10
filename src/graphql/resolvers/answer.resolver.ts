import { Answer } from "../../models/Answer";
import { IContext } from "../../context/IContext";

const answerResolvers = {
  Answer: {
    question: async (parent: Answer, _, { QuestionService }: IContext) => {
      return await QuestionService.getQuestionById(parent.question_id);
    },
  },
};

export default answerResolvers;
