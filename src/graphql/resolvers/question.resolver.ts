import { IContext } from "../../context/IContext.js";
import { QuestionResponseDTO } from "../../dto/question/QuestionResponseDTO.js";

const questionResolvers = {
  Query: {
    getFollowUpQuestionsByCategory: async (
      _,
      args,
      { QuestionService }: IContext,
    ) => {
      return await QuestionService.getFollowupQuestionsByCategory(
        args.categoryId,
      );
    },
  },
  QuestionWithChildren: {
    answers: async (
      parent: QuestionResponseDTO,
      _,
      { AnswerService }: IContext,
    ) => {
      return await AnswerService.getByQuestionId(parent.questionId);
    },
  },
};

export default questionResolvers;
