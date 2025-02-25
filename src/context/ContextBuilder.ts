import { IContext } from "./IContext";
import { AssessmentService } from "../services/implementations/AssessmentService";
import { AssessmentRepository } from "../repositories/implementations/AssessmentRepository";
import { LevelRepository } from "../repositories/implementations/LevelRepository";
import { LevelService } from "../services/implementations/LevelService";

export class ContextBuilder {
  static Build(): IContext {
    return {
      AssessmentService: new AssessmentService(
        new AssessmentRepository(),
        new LevelRepository(),
      ),
      LevelService: new LevelService(new LevelRepository()),
    };
  }
}
