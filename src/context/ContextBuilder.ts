import { IContext } from "./IContext";
import { AssessmentService } from "../services/implementations/AssessmentService";
import { AssessmentRepository } from "../repositories/implementations/AssessmentRepository";
import { LevelRepository } from "../repositories/implementations/LevelRepository";
import { LevelService } from "../services/implementations/LevelService";
import { UserRepository } from "../repositories/implementations/UserRepository";
import { UserService } from "../services/implementations/UserService";
import { QuestionService } from "../services/implementations/QuestionService";
import { QuestionRepository } from "../repositories/implementations/QuestionRepository";
import { AnswerService } from "../services/implementations/AnswerService";
import { AnswerRepository } from "../repositories/implementations/AnswerRepository";
import { CategoryService } from "../services/implementations/CategoryService";
import { CategoryRepository } from "../repositories/implementations/CategoryRepository";

export class ContextBuilder {
  static Build(): IContext {
    return {
      AssessmentService: new AssessmentService(
        new AssessmentRepository(),
        new LevelRepository(),
        new UserRepository(),
      ),
      LevelService: new LevelService(new LevelRepository()),
      UserService: new UserService(new UserRepository()),
      QuestionService: new QuestionService(new QuestionRepository()),
      AnswerService: new AnswerService(new AnswerRepository()),
      CategoryService: new CategoryService(new CategoryRepository()),
    };
  }
}
