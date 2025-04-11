import { GraphQLError, GraphQLErrorOptions } from "graphql";
import { ApolloServerErrorCodeExtended } from "../enums/ApolloServerErrorCodeExtended";

export class NotFound extends GraphQLError {
  constructor(message?: string, options?: GraphQLErrorOptions) {
    if (message) {
      super(message, {
        ...options,
        extensions: {
          ...options.extensions,
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
