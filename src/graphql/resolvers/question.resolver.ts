import { Question } from "../../models/Question";
import { IContext } from "../../context/IContext";

const questionResolvers = {
  Query: {
    getFollowUpQuestionsByCategory: async (
      _,
      args,
      { QuestionService }: IContext,
    ) => {
      return await QuestionService.getFollowupQuestionsByCategory(
        args.category_id,
      );
    },
  },
  QuestionWithChildren: {
    category: async (parent: Question, _, { CategoryService }: IContext) => {
      return await CategoryService.getById(parent.category_id);
    },
    answers: async (parent: Question, _, { AnswerService }: IContext) => {
      return await AnswerService.getByQuestionId(parent.question_id);
    },
  },
  Question: {
    category: async (parent: Question, _, { CategoryService }: IContext) => {
      return await CategoryService.getById(parent.category_id);
    },
  },
};

export default questionResolvers;
