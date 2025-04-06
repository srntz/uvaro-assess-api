import { IAssessmentService } from "../services/interfaces/IAssessmentService";
import { ILevelService } from "../services/interfaces/ILevelService";
import { IUserService } from "../services/interfaces/IUserService";
import { IQuestionService } from "../services/interfaces/IQuestionService";
import { IAnswerService } from "../services/interfaces/IAnswerService";
import { ICategoryService } from "../services/interfaces/ICategoryService";
import { Assessment } from "../models/Assessment";
import { INotificationService } from "../services/interfaces/INotificationService";

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
