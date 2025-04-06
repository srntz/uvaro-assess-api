import { IAssessmentService } from "../services/interfaces/IAssessmentService.js";
import { ILevelService } from "../services/interfaces/ILevelService.js";
import { IUserService } from "../services/interfaces/IUserService.js";
import { IQuestionService } from "../services/interfaces/IQuestionService.js";
import { IAnswerService } from "../services/interfaces/IAnswerService.js";
import { ICategoryService } from "../services/interfaces/ICategoryService.js";
import { Assessment } from "../models/Assessment.js";
import { INotificationService } from "../services/interfaces/INotificationService.js";

export interface IContext {
  AssessmentService: IAssessmentService;
  LevelService: ILevelService;
  UserService: IUserService;
  QuestionService: IQuestionService;
  AnswerService: IAnswerService;
  CategoryService: ICategoryService;
  NotificationService: INotificationService;
}

export interface IContextWithAuth extends IContext {
  AuthenticatedUser: {
    userId: string;
    email: string;
    assessments: Assessment[] | null;
  };
}
