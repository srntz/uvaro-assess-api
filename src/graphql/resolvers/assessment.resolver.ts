import { IContext, IContextWithAuth } from "../../context/IContext";
import { Assessment } from "../../models/Assessment";
import { UnauthorizedError } from "../../errors/errors/UnauthorizedError";
import { AnswerRequestDTO } from "../../dto/answer/AnswerRequestDTO";

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
      return await AssessmentService.getUserAssessments(
        AuthenticatedUser.user_id,
      );
    },

    getAssessmentById: async (
      _,
      args,
      { AssessmentService, AuthenticatedUser }: IContextWithAuth,
    ) => {
      if (AuthenticatedUser.user_id === null) {
        throw new UnauthorizedError();
      }
      return await AssessmentService.getAssessmentById(args.id);
    },

    getLevel: async (
      _,
      {
        categoryId,
        answers,
      }: { categoryId: number; answers: AnswerRequestDTO[] },
      { AssessmentService }: IContext,
    ) => {
      return await AssessmentService.getLevel(answers, categoryId);
    },
  },

  Mutation: {
    addAssessment: async (
      _,
      args,
      { AssessmentService, AuthenticatedUser }: IContextWithAuth,
    ) => {
      if (AuthenticatedUser.user_id === null) {
        throw new UnauthorizedError();
      }
      return await AssessmentService.addAssessment(AuthenticatedUser.user_id);
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

    completeCategory: async (
      _,
      {
        categoryId,
        assessmentId,
        answers,
      }: {
        categoryId: number;
        assessmentId: number;
        answers: AnswerRequestDTO[];
      },
      { AssessmentService, AuthenticatedUser }: IContextWithAuth,
    ) => {
      if (!AuthenticatedUser || !AuthenticatedUser.user_id) {
        throw new UnauthorizedError();
      }

      const userAssessments = await AssessmentService.getUserAssessments(
        AuthenticatedUser.user_id,
      );

      if (
        !userAssessments
          .map((item) => item.assessment_id)
          .includes(assessmentId)
      ) {
        throw new UnauthorizedError();
      }

      return await AssessmentService.completeCategory(
        categoryId,
        assessmentId,
        answers,
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
