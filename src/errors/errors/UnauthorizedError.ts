import { GraphQLError, GraphQLErrorOptions } from "graphql";
import { ApolloServerErrorCodeExtended } from "../enums/ApolloServerErrorCodeExtended";

export class UnauthorizedError extends GraphQLError {
  constructor(message?: string, options?: GraphQLErrorOptions) {
    if (message) {
      super(message, {
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
          code: ApolloServerErrorCodeExtended.BAD_REQUEST_WITH_MESSAGE,
        },
      });
    } else {
      super(null, {
        ...options,
        extensions: {
          ...options.extensions,
          code: ApolloServerErrorCodeExtended.BAD_REQUEST_WITH_MESSAGE,
        },
      });
    }
  }
}
