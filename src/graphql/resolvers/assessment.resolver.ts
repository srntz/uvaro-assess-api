import { IContext } from "../../context/IContext";
import { Assessment } from "../../models/Assessment";
import { AnswerInsertInput } from "../../interfaces/input/AnswerInsertInput";
import { mapAll } from "../../dto/mappers/mapAll";
import { mapAnswerInputToDTO } from "../../dto/mappers/mapAnswerInputToDTO";

interface ISubmitAssessmentInput {
  assessment_id: number;
  answers: AnswerInsertInput[];
}

const assessmentResolvers = {
  Query: {
    getUserAssessments: async (_, args, { AssessmentService }: IContext) =>
      AssessmentService.getUserAssessments(args.user_id),

    getAssessmentById: (_, args, { AssessmentService }: IContext) =>
      AssessmentService.getAssessmentById(args.id),

    getCalculatedLevel: async (_, args, { AssessmentService }: IContext) => {
      return await AssessmentService.getCalculatedLevel(
        args.input.category_id,
        mapAll(args.input.answers, mapAnswerInputToDTO),
      );
    },
  },

  Mutation: {
    addAssessment: (_, args, { AssessmentService }: IContext) =>
      AssessmentService.addAssessment(args.user_id),

    endAssessment: async (_, args, { AssessmentService }: IContext) => {
      return await AssessmentService.endAssessment(args.assessment_id);
    },

    addAssessmentAsGuest: (_, __, { AssessmentService }: IContext) =>
      AssessmentService.addAssessmentAsGuest(),

    saveAnswersInBatch: async (
      _,
      { input }: { input: ISubmitAssessmentInput },
      { AssessmentService }: IContext,
    ) => {
      return await AssessmentService.insertBatchedAnswers(
        input.assessment_id,
        mapAll(input.answers, mapAnswerInputToDTO),
      );
    },

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

    calculateAndSaveLevel: async (_, args, { AssessmentService }: IContext) => {
      return await AssessmentService.calculateAndSaveLevel(
        args.assessment_id,
        args.category_id,
      );
    },
  },

  AssessmentWithChildren: {
    answers: (parent: Assessment, _, { AssessmentService }: IContext) =>
      AssessmentService.getAssessmentAnswers(parent.id),

    notes: (parent: Assessment, _, { AssessmentService }: IContext) =>
      AssessmentService.getNotes(parent.id),

    levels: (parent: Assessment, _, { AssessmentService }: IContext) =>
      AssessmentService.getAssessmentLevels(parent.id),
  },
};

export default assessmentResolvers;
