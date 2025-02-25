import { IAssessment } from "../../db/schemas";
import { IContext } from "../../context/IContext";

const assessmentResolvers = {
  Query: {
    getUserAssessments: async (_, args, { AssessmentService }: IContext) =>
      AssessmentService.getUserAssessments(args.user_id),

    getAssessmentById: (_, args, { AssessmentService }: IContext) =>
      AssessmentService.getAssessmentById(args.id),
  },

  Mutation: {
    addAssessment: (_, args, { AssessmentService }: IContext) =>
      AssessmentService.addAssessment(args.user_id),

    endAssessment: (_, args, { AssessmentService }: IContext) =>
      AssessmentService.endAssessment(args.assessment_id),

    insertNote: (_, args, { AssessmentService }: IContext) =>
      AssessmentService.insertNote(
        args.assessment_id,
        args.category_id,
        args.note_text,
      ),
  },

  AssessmentWithChildren: {
    answers: (parent: IAssessment, _, { AssessmentService }: IContext) =>
      AssessmentService.getAssessmentAnswers(parent.assessment_id),

    notes: (parent: IAssessment, _, { AssessmentService }: IContext) =>
      AssessmentService.getNotes(parent.assessment_id),
  },
};

export default assessmentResolvers;
