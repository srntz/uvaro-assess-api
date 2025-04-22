import z from "zod";
import { BadRequest } from "../../errors/errors/BadRequest";

/**
 * Validates GraphQL args against the provided zod schema.
 * @throws ```BadRequest``` if the args did not pass validation.
 */
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
        throw new BadRequest("Validation error", {
          extensions: {
            validationErrors: error.errors,
          },
        });
      }
      throw error;
    }
  };
}
