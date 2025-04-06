import { IContextWithAuth } from "../../context/IContext.js";
import { AssessmentRepository } from "../../repositories/implementations/AssessmentRepository.js";

export function withUserAssessments(next) {
  return async (parent, args, context: IContextWithAuth, info) => {
    const assessmentRepository = new AssessmentRepository();
    context.AuthenticatedUser.assessments =
      await assessmentRepository.getUserAssessments(
        context.AuthenticatedUser.userId,
      );

    return next(parent, args, context, info);
  };
}
