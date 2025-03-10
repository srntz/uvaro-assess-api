import { Category } from "../../models/Category";
import { IContext } from "../../context/IContext";

const categoryResolvers = {
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
