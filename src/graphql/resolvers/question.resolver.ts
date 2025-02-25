import { CategoryService } from "../../services/CategoryService";
import { AnswerService } from "../../services/AnswerService";
import { Question } from "../../models/Question";

async function categoryFieldResolver(parent: Question) {
  const service = new CategoryService();
  return await service.get(parent.category_id);
}

async function answersFieldResolver(parent: Question) {
  const service = new AnswerService();
  return await service.getRelated(parent.question_id);
}

const questionResolvers = {
  QuestionWithChildren: {
    category: (parent: Question) => categoryFieldResolver(parent),
    answers: (parent: Question) => answersFieldResolver(parent),
  },
  Question: {
    category: (parent: Question) => categoryFieldResolver(parent),
  },
};

export default questionResolvers;
