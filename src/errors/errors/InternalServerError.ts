import { GraphQLError, GraphQLErrorOptions } from "graphql";
import { ApolloServerErrorCodeExtended } from "../enums/ApolloServerErrorCodeExtended";

/**
 * An extension of GraphQLError that corresponds to HTTP InternalServerError (500).
 *
 * NOTE: This error must be thrown instead of the generic GraphQLError where applicable.
 */
export class InternalServerError extends GraphQLError {
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
          code: ApolloServerErrorCodeExtended.INTERNAL_SERVER_ERROR_WITH_MESSAGE,
        },
      });
    } else {
      super(null, {
        ...errorOptions,
        extensions: {
          ...errorOptions.extensions,
          code: ApolloServerErrorCodeExtended.INTERNAL_SERVER_ERROR,
        },
      });
    }
  }
}
