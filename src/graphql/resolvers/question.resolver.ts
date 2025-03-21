import { IContext } from "../../context/IContext";
import { validateArgs } from "../../validation/validation";
import { z } from 'zod';
import { QuestionResponseDTO } from "../../dto/question/QuestionResponseDTO";

// query schema
const followUpQuestionsSchema = z.object({
  category_id: z.number({
    required_error: "Category ID is required",
    invalid_type_error: "Category ID must be a number"
  }).int().positive("Category ID must be a positive integer")
});


const questionResolvers = {
  Query: {
    getFollowUpQuestionsByCategory: async (
      _,
      args,
      { QuestionService }: IContext,
    ) => {
      return await QuestionService.getFollowupQuestionsByCategory(
        args.categoryId,
      );
    },
  },
  QuestionWithChildren: {
    answers: async (
      parent: QuestionResponseDTO,
      _,
      { AnswerService }: IContext,
    ) => {
      return await AnswerService.getByQuestionId(parent.questionId);
    },
  },
};

export default questionResolvers;
