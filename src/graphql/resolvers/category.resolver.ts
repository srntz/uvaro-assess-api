import { IContext } from "../../context/IContext";
import { CategoryResponseDTO } from "../../dto/category/CategoryResponseDTO";

const categoryResolvers = {
  Query: {
    allCategories: async (_, __, { CategoryService }: IContext) => {
      return await CategoryService.getAll();
    },
  },
  CategoryWithChildren: {
    questions: async (
      category: CategoryResponseDTO,
      _,
      { QuestionService }: IContext,
    ) => {
      return await QuestionService.getRegularQuestionsByCategory(
        category.categoryId,
      );
    },
    levels: async (
      parent: CategoryResponseDTO,
      _,
      { LevelService }: IContext,
    ) => {
      return await LevelService.getLevelsByCategory(parent.categoryId);
    },
  },
};

export default categoryResolvers;
