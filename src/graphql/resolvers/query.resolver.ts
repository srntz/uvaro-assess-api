import { CategoryService } from "../../services/CategoryService";
import { LevelService } from "../../services/LevelService";
import { QuestionService } from "../../services/QuestionService";
import { AnswerService } from "../../services/AnswerService";
import { Service } from "../../services/Service";
import { Level } from "../../models/Level";
import { Question } from "../../models/Question";
import { Answer } from "../../models/Answer";
import { Category } from "../../models/Category";
import { AssessmentService } from "../../services/AssessmentService";
import { Assessment } from "../../models/Assessment";

async function categoriesFieldResolver() {
  const service: Service<Category> = new CategoryService();
  return await service.getAll();
}

async function categoryFieldResolver(category_id: number) {
  const service: Service<Category> = new CategoryService();
  return await service.get(category_id);
}

async function levelsFromCategoryFieldResolver(category_id: number) {
  const service: Service<Level> = new LevelService();
  return await service.getRelated(category_id);
}

async function levelFieldResolver(level_id: number) {
  const service: Service<Level> = new LevelService();
  return await service.get(level_id);
}

async function questionFieldResolver(question_id: number) {
  const service: Service<Question> = new QuestionService();
  return await service.get(question_id);
}

async function questionsFromCategoryFieldResolver(category_id: number) {
  const service: Service<Question> = new QuestionService();
  return await service.getRelated(category_id);
}

async function answerFieldResolver(answer_id: number) {
  const service: Service<Answer> = new AnswerService();
  return await service.get(answer_id);
}

async function answersFromQuestionFieldResolver(question_id: number) {
  const service: Service<Answer> = new AnswerService();
  return await service.getRelated(question_id);
}

async function getAssessmentsResolver(user_id: string) {
  const service: Service<Assessment> = new AssessmentService();
  return await service.getRelated(user_id);
}

async function getAssessmentResolver(assessment_id: string) {
  const service: Service<Assessment> = new AssessmentService();
  return await service.get(assessment_id);
}

const queryResolvers = {
  Query: {
    allCategories: categoriesFieldResolver,

    getAssessments: (_, args) => getAssessmentsResolver(args.user_id),
    getAssessment: (_, args) => getAssessmentResolver(args.id),

    category: (_, args) => categoryFieldResolver(args.id),

    levelsFromCategory: (_, args) =>
      levelsFromCategoryFieldResolver(args.category_id),

    level: (_, args) => levelFieldResolver(args.id),

    question: (_, args) => questionFieldResolver(args.id),

    questionsFromCategory: (_, args) =>
      questionsFromCategoryFieldResolver(args.category_id),

    answer: (_, args) => answerFieldResolver(args.id),

    answersFromQuestion: (_, args) =>
      answersFromQuestionFieldResolver(args.question_id),
  },
};

export default queryResolvers;
