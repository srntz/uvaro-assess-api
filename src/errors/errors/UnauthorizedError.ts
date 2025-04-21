import { GraphQLError, GraphQLErrorOptions } from "graphql";
import { ApolloServerErrorCodeExtended } from "../enums/ApolloServerErrorCodeExtended";

/**
 * An extension of GraphQLError that corresponds to the HTTP Unauthorized (401) error.
 *
 * NOTE: This error must be thrown instead of the generic GraphQLError where applicable.
 */
export class UnauthorizedError extends GraphQLError {
  constructor(message?: string, options?: GraphQLErrorOptions) {
    const errorOptions = {
      ...(options || {}),
      extensions: {
        ...(() => {
          if (
            options &&
            Object.prototype.hasOwnProperty.call(options, "extensions")
          ) {
            return options.extensions;
          }
          return {};
        })(),
      },
    };
    if (message) {
      super(message, {
        ...errorOptions,
        extensions: {
          ...errorOptions.extensions,
          code: ApolloServerErrorCodeExtended.UNAUTHORIZED_WITH_MESSAGE,
        },
      });
    } else {
      super(null, {
        ...errorOptions,
        extensions: {
          ...errorOptions.extensions,
          code: ApolloServerErrorCodeExtended.UNAUTHORIZED,
        },
      });
    }
  }
}
