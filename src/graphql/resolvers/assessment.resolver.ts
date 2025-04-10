import { array, object, z } from "zod";
import { IContext, IContextWithAuth } from "../../context/IContext";
import { UnauthorizedError } from "../../errors/errors/UnauthorizedError";
import { AnswerRequestDTO } from "../../dto/answer/AnswerRequestDTO";
import { GraphQLError } from "graphql";
import { withAuthenticationRequired } from "../middleware/withAuthenticationRequired";
import { withUserAssessments } from "../middleware/withUserAssessments";
import { AssessmentResponseDTO } from "../../dto/assessment/AssessmentResponseDTO";
import { withInputValidation } from "../middleware/withInputValidation";
import {
  endAssessmentSchema,
  getAssessmentByIdSchema,
  insertNoteSchema,
} from "../../validation/schemas/AssessmentResolverSchemas";

// query schemas
const getUserAssessmentsSchema = z.object({
  user_id: z
    .string({
      required_error: "User ID is required",
      invalid_type_error: "User ID must be a string",
    })
    .min(1, "User ID cannot be empty"),
});

const insertAnswerSchema = z.object({
  assessment_id: z
    .number({
      required_error: "Assessment ID is required",
      invalid_type_error: "Assessment ID must be a number",
    })
    .int()
    .positive("Assessment ID must be a positive integer"),
  question_id: z
    .number({
      required_error: "Question ID is required",
      invalid_type_error: "Question ID must be a number",
    })
    .int()
    .positive("Question ID must be a positive integer"),
  answer_id: z
    .number({
      required_error: "Answer ID is required",
      invalid_type_error: "Answer ID must be a number",
    })
    .int()
    .positive("Answer ID must be a positive integer"),
});

const calculateLevelSchema = z.object({
  categoryId: z
    .number({
      required_error: "Category ID is required",
      invalid_type_error: "Category ID must be a number",
    })
    .int()
    .positive("Category ID must be a positive integer"),
  answers: array(
    object({
      answerId: z.number().int().min(1).positive(),
    }),
  ),
});

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
      withInputValidation(
        getAssessmentByIdSchema,
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
    ),

    calculateLevel: withInputValidation(
      calculateLevelSchema,
      async (
        _,
        {
          categoryId,
          answers,
        }: { categoryId: number; answers: AnswerRequestDTO[] },
        { AssessmentService }: IContext,
      ) => {
        return await AssessmentService.calculateLevel(answers, categoryId);
      },
    ),
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
      withInputValidation(
        endAssessmentSchema,
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

            if (process.env.ENABLE_SLACK_NOTIFICATIONS === "true") {
              NotificationService.send(
                args.assessmentId,
                AuthenticatedUser.userId,
              );
            }

            return levels;
          },
        ),
      ),
    ),

    insertNote: withAuthenticationRequired(
      withInputValidation(
        insertNoteSchema,
        withUserAssessments(
          async (
            _,
            args,
            { AssessmentService, AuthenticatedUser }: IContextWithAuth,
          ) => {
            if (
              !AuthenticatedUser.assessments.find(
                (item) => item.assessment_id === args.assessmentId,
              )
            ) {
              throw new UnauthorizedError();
            }

            return await AssessmentService.insertNote(
              args.assessmentId,
              args.categoryId,
              args.noteText,
            );
          },
        ),
      ),
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
