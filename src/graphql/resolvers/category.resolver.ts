import { Category } from "../../models/Category";
import { IContext } from "../../context/IContext";
import { mapAll } from "../../dto/mappers/mapAll";
import { AnswerInsertInput } from "../../interfaces/input/AnswerInsertInput";
import { mapAnswerInputToDTO } from "../../dto/mappers/mapAnswerInputToDTO";

interface CompleteCategoryInput {
  assessment_id: number;
  answers: AnswerInsertInput[];
}

const categoryResolvers = {
  Query: {
    allCategories: async (_, __, { CategoryService }: IContext) => {
      return await CategoryService.getAll();
    },
  },

  // Mutation: {
  //   completeCategory: async (
  //     _,
  //     { input }: { input: CompleteCategoryInput },
  //     { AssessmentService }: IContext,
  //   ) => {
  //     return await AssessmentService.insertBatchedAnswers(
  //       input.assessment_id,
  //       mapAll(input.answers, mapAnswerInputToDTO),
  //     );
  //   },
  // },

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
