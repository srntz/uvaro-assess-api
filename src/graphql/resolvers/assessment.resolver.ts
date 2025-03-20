import { IContext, IContextWithAuth } from "../../context/IContext";
import { Assessment } from "../../models/Assessment";
import { UnauthorizedError } from "../../errors/errors/UnauthorizedError";

const assessmentResolvers = {
  Query: {
    getUserAssessments: async (
      _,
      args,
      { AssessmentService, AuthenticatedUser }: IContextWithAuth,
    ) => {
      if (AuthenticatedUser.user_id === null) {
        throw new UnauthorizedError();
      }
      AssessmentService.getUserAssessments(AuthenticatedUser.user_id);
    },

    getAssessmentById: (
      _,
      args,
      { AssessmentService, AuthenticatedUser }: IContextWithAuth,
    ) => {
      if (AuthenticatedUser.user_id === null) {
        throw new UnauthorizedError();
      }
      AssessmentService.getAssessmentById(args.id);
    },
  },

  Mutation: {
    addAssessment: (
      _,
      args,
      { AssessmentService, AuthenticatedUser }: IContextWithAuth,
    ) => {
      if (AuthenticatedUser.user_id === null) {
        throw new UnauthorizedError();
      }
      AssessmentService.addAssessment(AuthenticatedUser.user_id);
    },

    addAssessmentAsGuest: (_, __, { AssessmentService }: IContext) =>
      AssessmentService.addAssessmentAsGuest(),

    endAssessment: async (
      _,
      args,
      { AssessmentService, AuthenticatedUser }: IContextWithAuth,
    ) => {
      if (AuthenticatedUser.user_id === null) {
        throw new UnauthorizedError();
      }
      return await AssessmentService.endAssessment(args.assessment_id);
    },

    insertNote: async (
      _,
      args,
      { AssessmentService, AuthenticatedUser }: IContextWithAuth,
    ) => {
      if (AuthenticatedUser.user_id === null) {
        throw new UnauthorizedError();
      }

      return await AssessmentService.insertNote(
        args.assessment_id,
        args.category_id,
        args.note_text,
      );
    },

    insertAnswer: async (
      _,
      args,
      { AssessmentService, AuthenticatedUser }: IContextWithAuth,
    ) => {
      if (AuthenticatedUser.user_id === null) {
        throw new UnauthorizedError();
      }
      return await AssessmentService.insertAnswer(
        args.assessment_id,
        args.question_id,
        args.answer_id,
      );
    },

    calculateLevel: async (
      _,
      args,
      { AssessmentService, AuthenticatedUser }: IContextWithAuth,
    ) => {
      if (AuthenticatedUser.user_id === null) {
        throw new UnauthorizedError();
      }
      return await AssessmentService.calculateLevel(
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
