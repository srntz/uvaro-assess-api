import { GraphQLError } from "graphql";
import { ApolloServerErrorCodeExtended } from "../enums/ApolloServerErrorCodeExtended";

export class InternalServerError extends GraphQLError {
  constructor(message?: string) {
    if (message) {
      super(message, {
        extensions: {
          code: ApolloServerErrorCodeExtended.INTERNAL_SERVER_ERROR_WITH_MESSAGE,
        },
      });
    } else {
      super("InternalServerError", {
        extensions: {
          code: ApolloServerErrorCodeExtended.INTERNAL_SERVER_ERROR,
        },
      });
    }
  }
}
