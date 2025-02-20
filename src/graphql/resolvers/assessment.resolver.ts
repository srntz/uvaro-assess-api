import { IAssessment } from "../../db/schemas";
import { AssessmentService } from "../../services/AssessmentService";

async function assessmentAnswerResolver(assessment_id: number) {
  const service = new AssessmentService();
  return await service.getAnswers(assessment_id);
}

export const assessmentResolvers = {
  AssessmentWithChildren: {
    answers: (parent: IAssessment) =>
      assessmentAnswerResolver(parent.assessment_id),
  },
};
