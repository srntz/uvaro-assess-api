import { IContext, IContextWithAuth } from "../../context/IContext";
import { Assessment } from "../../models/Assessment";
import { UnauthorizedError } from "../../errors/errors/UnauthorizedError";
import { AnswerRequestDTO } from "../../dto/answer/AnswerRequestDTO";
import { GraphQLError } from "graphql/error";
import { withAuthenticationRequired } from "../middleware/withAuthenticationRequired";
import { withUserAssessments } from "../middleware/withUserAssessments";

const assessmentResolvers = {
  Query: {
    getUserAssessments: withAuthenticationRequired(
      async (
        _,
        args,
        { AssessmentService, AuthenticatedUser }: IContextWithAuth,
      ) => {
        return await AssessmentService.getUserAssessments(
          AuthenticatedUser.userId,
        );
      },
    ),

    getAssessmentById: withAuthenticationRequired(
      async (
        _,
        args,
        { AssessmentService, AuthenticatedUser }: IContextWithAuth,
      ) => {
        if (AuthenticatedUser.userId === null) {
          throw new UnauthorizedError();
        }
        return await AssessmentService.getAssessmentById(args.id);
      },
    ),

    calculateLevel: async (
      _,
      {
        categoryId,
        answers,
      }: { categoryId: number; answers: AnswerRequestDTO[] },
      { AssessmentService }: IContext,
    ) => {
      return await AssessmentService.calculateLevel(answers, categoryId);
    },
  },

  Mutation: {
    addAssessment: withAuthenticationRequired(
      async (
        _,
        args,
        { AssessmentService, AuthenticatedUser }: IContextWithAuth,
      ) => {
        return await AssessmentService.addAssessment(AuthenticatedUser.userId);
      },
    ),

    endAssessment: withAuthenticationRequired(
      withUserAssessments(
        async (
          _,
          args,
          { AssessmentService, AuthenticatedUser }: IContextWithAuth,
        ) => {
          const matchedAssessment = AuthenticatedUser.assessments.find(
            (item) => item.assessment_id === args.assessmentId,
          );

          if (!matchedAssessment) {
            throw new UnauthorizedError();
          }

          if (matchedAssessment.end_date_time) {
            throw new GraphQLError("The assessment is already finished");
          }

          return await AssessmentService.endAssessment(args.assessmentId);
        },
      ),
    ),

    insertNote: withAuthenticationRequired(
      async (_, args, { AssessmentService }: IContextWithAuth) => {
        return await AssessmentService.insertNote(
          args.assessmentId,
          args.categoryId,
          args.noteText,
        );
      },
    ),

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
      { AssessmentService }: IContextWithAuth,
    ) => {
      return await AssessmentService.calculateLevel(
        args.assessmentId,
        args.categoryId,
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
