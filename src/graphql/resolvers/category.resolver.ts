import { QuestionService } from "../../services/QuestionService";
import { Question } from "../../models/Question";
import { Category } from "../../models/Category";
import { IContext } from "../../context/IContext";

async function questionsFieldResolver(parent: Question) {
  const service = new QuestionService();
  return await service.getRelated(parent.category_id);
}

const categoryResolvers = {
  CategoryWithChildren: {
    questions: (parent: Question) => questionsFieldResolver(parent),
    levels: (parent: Category, _, { LevelService }: IContext) =>
      LevelService.getLevelsByCategory(parent.category_id),
  },
};

export default categoryResolvers;
