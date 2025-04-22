import { IContextWithAuth } from "../../context/IContext";
import { AssessmentRepository } from "../../repositories/implementations/AssessmentRepository";

/**
 * Injects all assessments owned by the user into the context.
 */
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
