import { CategoryService } from "../../services/CategoryService";
import { AnswerService } from "../../services/AnswerService";
import { Question } from "../../models/Question";
import { IContext } from "../../context/IContext";

async function categoryFieldResolver(parent: Question) {
  const service = new CategoryService();
  return await service.get(parent.category_id);
}

async function answersFieldResolver(parent: Question) {
  const service = new AnswerService();
  return await service.getRelated(parent.question_id);
}

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
    category: (parent: Question) => categoryFieldResolver(parent),
    answers: (parent: Question) => answersFieldResolver(parent),
  },
  Question: {
    category: (parent: Question) => categoryFieldResolver(parent),
  },
};

export default questionResolvers;
