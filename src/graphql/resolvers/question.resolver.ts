import { IContext } from "../../context/IContext";
import { QuestionResponseDTO } from "../../dto/question/QuestionResponseDTO";
import { withInputValidation } from "../middleware/withInputValidation";
import { getFollowUpQuestionsByCategorySchema } from "../../validation/schemas/QuestionResolverSchemas";

const questionResolvers = {
  Query: {
    getFollowUpQuestionsByCategory: withInputValidation(
      getFollowUpQuestionsByCategorySchema,
      async (_, args, { QuestionService }: IContext) => {
        return await QuestionService.getFollowupQuestionsByCategory(
          args.categoryId,
        );
      },
    ),
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
