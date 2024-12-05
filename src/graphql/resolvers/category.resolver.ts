import {QuestionService} from "../../services/QuestionService";
import {Question} from "../../models/Question";
import {Level} from "../../models/Level";
import {LevelService} from "../../services/LevelService";

async function questionsFieldResolver(parent: any): Promise<Question[]> {
  const service = new QuestionService()
  return await service.getRelated(parent.category_id)
}

async function levelsFieldResolver(parent: any): Promise<Level[]> {
  const service = new LevelService();
  return await service.getRelated(parent.category_id)
}

export const categoryResolvers = {
  CategoryWithChildren: {
    questions: (parent) => questionsFieldResolver(parent),
    levels: (parent) => levelsFieldResolver(parent),
  }
}
