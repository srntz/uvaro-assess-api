import { IContext, IContextWithAuth } from "../../context/IContext";
import { Assessment } from "../../models/Assessment";
import { UnauthorizedError } from "../../errors/errors/UnauthorizedError";
import { AnswerRequestDTO } from "../../dto/answer/AnswerRequestDTO";
import { GraphQLError } from "graphql/error";
import { withAuthenticationRequired } from "../middleware/withAuthenticationRequired";
import { withUserAssessments } from "../middleware/withUserAssessments";

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

    completeCategory: withAuthenticationRequired(
      withUserAssessments(
        async (
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
          const matchedAssessment = AuthenticatedUser.assessments.find(
            (item) => item.assessment_id === assessmentId,
          );

          if (matchedAssessment === undefined) {
            throw new UnauthorizedError();
          }

          if (matchedAssessment.end_date_time) {
            throw new GraphQLError("The assessment is already finished");
          }

          return await AssessmentService.completeCategory(
            categoryId,
            assessmentId,
            answers,
          );
        },
      ),
    ),

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
      AssessmentService.getAssessmentAnswers(parent.assessment_id),

    notes: (parent: Assessment, _, { AssessmentService }: IContext) =>
      AssessmentService.getNotes(parent.assessment_id),

    levels: (parent: Assessment, _, { AssessmentService }: IContext) =>
      AssessmentService.getAssessmentLevels(parent.assessment_id),
  },
};

export default assessmentResolvers;
