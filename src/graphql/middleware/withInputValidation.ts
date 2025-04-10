import { GraphQLError } from "graphql/index";
import z from "zod";

export function withInputValidation<T>(
  schema: z.ZodSchema<T>,
  next: (parent, args, context, info) => unknown,
) {
  return async (parent, args, context, info) => {
    try {
      const validatedArgs = schema.parse(args);
      return await next(parent, validatedArgs, context, info);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new GraphQLError("Validation error", {
          extensions: {
            code: "BAD_USER_INPUT",
            validationErrors: error.errors,
          },
        });
      }
      throw error;
    }
  };
}
