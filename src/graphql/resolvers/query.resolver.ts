import {CategoryService} from "../../services/CategoryService";
import {LevelService} from "../../services/LevelService";
import {QuestionService} from "../../services/QuestionService";
import {AnswerService} from "../../services/AnswerService";
import {Service} from "../../services/Service";
import {IAnswer, ICategory} from "../../db/schemas";
import {Level} from "../../models/Level";
import {Question} from "../../models/Question";

async function categoriesFieldResolver() {
  const service: Service<ICategory> = new CategoryService();
  return await service.getAll();
}

async function categoryFieldResolver(args) {
  const service: Service<ICategory> = new CategoryService();
  return await service.get(args.id);
}

async function levelsFromCategoryFieldResolver(args: any) {
  const service: Service<Level> = new LevelService();
  return await service.getRelated(args.category_id);
}

async function levelsFieldResolver(args: any) {
  const service: Service<Level> = new LevelService();
  return await service.get(args.id);
}

async function questionFieldResolver(args: any) {
  const service: Service<Question> = new QuestionService();
  return await service.get(args.id);
}

async function questionsFromCategoryFieldResolver(args: any) {
  const service: Service<Question> = new QuestionService();
  return await service.getRelated(args.category_id);
}

async function answerFieldResolver(args: any) {
  const service: Service<IAnswer> = new AnswerService();
  return await service.get(args.id);
}

async function answersFromQuestionFieldResolver(args: any) {
  const service: Service<IAnswer> = new AnswerService();
  return await service.getRelated(args.question_id);
}

export const queryResolvers = {
  Query: {
    allCategories: categoriesFieldResolver,
    category: (parent, args) => categoryFieldResolver(args),
    levelsFromCategory: (parent, args) => levelsFromCategoryFieldResolver(args),
    level: (parent, args) => levelsFieldResolver(args),
    question: (parent, args) => questionFieldResolver(args),
    questionsFromCategory: (parent, args) => questionsFromCategoryFieldResolver(args),
    answer: (parend, args) => answerFieldResolver(args),
    answersFromQuestion: (parent, args) => answersFromQuestionFieldResolver(args),
  }
}
