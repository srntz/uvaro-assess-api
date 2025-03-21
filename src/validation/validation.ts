import { z } from 'zod';
import { GraphQLError } from 'graphql';

export function validateArgs<T>(schema: z.ZodSchema<T>) {
  return (resolver: any) => {
    return async (parent: any, args: any, context: any, info: any) => {
      try {
        const validatedArgs = schema.parse(args);
        return await resolver(parent, validatedArgs, context, info);
      } catch (error) {
        if (error instanceof z.ZodError) {
          throw new GraphQLError('Validation error', {
            extensions: {
              code: 'BAD_USER_INPUT',
              validationErrors: error.errors
            }
          });
        }
        throw error;
      }
    };
  };
}
