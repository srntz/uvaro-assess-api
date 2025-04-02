import { IContext, IContextWithAuth } from "../../context/IContext";
import { UnauthorizedError } from "../../errors/errors/UnauthorizedError";
import { AnswerRequestDTO } from "../../dto/answer/AnswerRequestDTO";
import { GraphQLError } from "graphql/error";
import { withAuthenticationRequired } from "../middleware/withAuthenticationRequired";
import { withUserAssessments } from "../middleware/withUserAssessments";
import { AssessmentResponseDTO } from "../../dto/assessment/AssessmentResponseDTO";

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
          {
            AssessmentService,
            AuthenticatedUser,
            NotificationService,
          }: IContextWithAuth,
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

          const levels = await AssessmentService.endAssessment(
            args.assessmentId,
          );

          NotificationService.send(args.assessmentId, AuthenticatedUser.userId);

          return levels;
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
  },

  AssessmentWithChildren: {
    answers: (
      parent: AssessmentResponseDTO,
      _,
      { AssessmentService }: IContext,
    ) => AssessmentService.getAssessmentAnswers(parent.assessmentId),

    notes: (
      parent: AssessmentResponseDTO,
      _,
      { AssessmentService }: IContext,
    ) => AssessmentService.getNotes(parent.assessmentId),

    levels: (
      parent: AssessmentResponseDTO,
      _,
      { AssessmentService }: IContext,
    ) => AssessmentService.getAssessmentLevels(parent.assessmentId),
  },
};

export default assessmentResolvers;
