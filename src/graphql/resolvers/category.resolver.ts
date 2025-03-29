import { Category } from "../../models/Category";
import { IContext } from "../../context/IContext";
import { UnauthorizedError } from "../../errors/errors/UnauthorizedError";

const categoryResolvers = {
  Query: {
    allCategories: async (_, __, { CategoryService }: IContext) => {
      return await CategoryService.getAll();
    },
  },
  CategoryWithChildren: {
    questions: async (category: Category, _, { QuestionService }: IContext) => {
      return await QuestionService.getRegularQuestionsByCategory(
        category.category_id,
      );
    },
    levels: async (parent: Category, _, { LevelService }: IContext) => {
      return await LevelService.getLevelsByCategory(parent.category_id);
    },
  },
};

export default categoryResolvers;
