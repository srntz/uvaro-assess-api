import { IContext } from "./IContext";
import { AssessmentService } from "../services/implementations/AssessmentService";
import { AssessmentRepository } from "../repositories/implementations/AssessmentRepository";

export class ContextBuilder {
  static Build(): IContext {
    return {
      AssessmentService: new AssessmentService(new AssessmentRepository()),
    };
  }
}
