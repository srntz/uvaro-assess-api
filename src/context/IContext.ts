import { IAssessmentService } from "../services/interfaces/IAssessmentService";
import { ILevelService } from "../services/interfaces/ILevelService";
import { IUserService } from "../services/interfaces/IUserService";

export interface IContext {
  AssessmentService: IAssessmentService;
  LevelService: ILevelService;
  UserService: IUserService;
}
