import { IContext } from "../../context/IContext";
import { Assessment } from "../../models/Assessment";

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

    insertAnswer: (_, args, { AssessmentService }: IContext) =>
      AssessmentService.insertAnswer(
        args.assessment_id,
        args.question_id,
        args.answer_id,
      ),
  },

  AssessmentWithChildren: {
    answers: (parent: Assessment, _, { AssessmentService }: IContext) =>
      AssessmentService.getAssessmentAnswers(parent.id),

    notes: (parent: Assessment, _, { AssessmentService }: IContext) =>
      AssessmentService.getNotes(parent.id),
  },
};

export default assessmentResolvers;
