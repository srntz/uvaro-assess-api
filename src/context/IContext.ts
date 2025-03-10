import { IAssessmentService } from "../services/interfaces/IAssessmentService";
import { ILevelService } from "../services/interfaces/ILevelService";
import { IUserService } from "../services/interfaces/IUserService";
import { IQuestionService } from "../services/interfaces/IQuestionService";
import { IImageService } from "../services/interfaces/IImageService";

export interface IContext {
  AssessmentService: IAssessmentService;
  LevelService: ILevelService;
  UserService: IUserService;
  ImageService: IImageService;
  QuestionService: IQuestionService;
}
