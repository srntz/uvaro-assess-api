import { IAssessment } from "../../db/schemas";
import { AssessmentService } from "../../services/AssessmentService";
import { NoteService } from "../../services/NoteService";

async function assessmentAnswerResolver(assessment_id: number) {
  const service = new AssessmentService();
  return await service.getAnswers(assessment_id);
}

async function assessmentNoteResolver(assessment_id: number) {
  const service = new NoteService();
  return await service.getRelated(assessment_id);
}

export const assessmentResolvers = {
  AssessmentWithChildren: {
    answers: (parent: IAssessment) =>
      assessmentAnswerResolver(parent.assessment_id),
    notes: (parent: IAssessment) =>
      assessmentNoteResolver(parent.assessment_id),
  },
};
