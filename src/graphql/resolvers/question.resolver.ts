import {CategoryService} from "../../services/CategoryService";
import {AnswerService} from "../../services/AnswerService";

async function categoryFieldResolver(parent: any) {
  const service = new CategoryService();
  return await service.get(parent.category_id);
}

async function answersFieldResolver(parent: any) {
  const service = new AnswerService();
  return await service.getRelated(parent.question_id);
}

export const questionResolvers = {
  QuestionWithChildren: {
    category: (parent) => categoryFieldResolver(parent),
    answers: (parent) => answersFieldResolver(parent),
  },
  Question: {
    category: (parent) => categoryFieldResolver(parent)
  }
}
