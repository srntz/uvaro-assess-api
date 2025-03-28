import { IContextWithAuth } from "../../context/IContext";

export function withUserAssessments(next) {
  return async (parent, args, context: IContextWithAuth, info) => {
    context.AuthenticatedUser.assessments =
      await context.AssessmentService.getUserAssessments(
        context.AuthenticatedUser.user_id,
      );

    return next(parent, args, context, info);
  };
}
