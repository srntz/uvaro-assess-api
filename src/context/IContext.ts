import { IAssessmentService } from "../services/interfaces/IAssessmentService";
import { ILevelService } from "../services/interfaces/ILevelService";

export interface IContext {
  AssessmentService: IAssessmentService;
  LevelService: ILevelService;
}
