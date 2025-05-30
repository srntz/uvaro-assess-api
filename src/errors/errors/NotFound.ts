import { GraphQLError, GraphQLErrorOptions } from "graphql";
import { ApolloServerErrorCodeExtended } from "../enums/ApolloServerErrorCodeExtended";

/**
 * An extension of GraphQLError that corresponds to the HTTP NotFound (404) error.
 *
 * NOTE: This error must be thrown instead of the generic GraphQLError where applicable.
 */
export class NotFound extends GraphQLError {
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
          code: ApolloServerErrorCodeExtended.NOT_FOUND_WITH_MESSAGE,
        },
      });
    } else {
      super(null, {
        ...errorOptions,
        extensions: {
          ...errorOptions.extensions,
          code: ApolloServerErrorCodeExtended.NOT_FOUND,
        },
      });
    }
  }
}
