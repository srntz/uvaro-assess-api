import {QuestionService} from "../../services/QuestionService";
import {Question} from "../../models/Question";
import {LevelService} from "../../services/LevelService";

async function questionsFieldResolver(parent: Question) {
  const service = new QuestionService()
  return await service.getRelated(parent.category_id)
}

async function levelsFieldResolver(parent: Question) {
  const service = new LevelService();
  return await service.getRelated(parent.category_id)
}

export const categoryResolvers = {
  CategoryWithChildren: {
    questions: (parent: Question) => questionsFieldResolver(parent),
    levels: (parent: Question) => levelsFieldResolver(parent),
  }
}
