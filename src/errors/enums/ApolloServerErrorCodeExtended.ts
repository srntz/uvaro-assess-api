import { ApolloServerErrorCode } from "@apollo/server/errors";

/**
 * This is an extension of the ApolloServerErrorCode enum.
 * It is used to allow for custom internal error types which improves the flexibility of error handling
 *
 * NOTE: This enum must be used instead of ApolloServerErrorCode.
 */
export enum ApolloServerErrorCodeExtended {
  INTERNAL_SERVER_ERROR = ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
  INTERNAL_SERVER_ERROR_WITH_MESSAGE = "INTERNAL_SERVER_ERROR_WITH_MESSAGE",

  GRAPHQL_PARSE_FAILED = ApolloServerErrorCode.GRAPHQL_PARSE_FAILED,
  GRAPHQL_VALIDATION_FAILED = ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED,
  PERSISTED_QUERY_NOT_FOUND = ApolloServerErrorCode.PERSISTED_QUERY_NOT_FOUND,
  PERSISTED_QUERY_NOT_SUPPORTED = ApolloServerErrorCode.PERSISTED_QUERY_NOT_SUPPORTED,

  NOT_FOUND = "NOT_FOUND",
  NOT_FOUND_WITH_MESSAGE = "NOT_FOUND_WITH_MESSAGE",

  BAD_USER_INPUT = ApolloServerErrorCode.BAD_USER_INPUT,
  OPERATION_RESOLUTION_FAILURE = ApolloServerErrorCode.OPERATION_RESOLUTION_FAILURE,

  BAD_REQUEST = ApolloServerErrorCode.BAD_REQUEST,
  BAD_REQUEST_WITH_MESSAGE = "BAD_REQUEST_WITH_MESSAGE",

  UNAUTHORIZED = "UNAUTHORIZED",
  UNAUTHORIZED_WITH_MESSAGE = "UNAUTHORIZED_WITH_MESSAGE",
}
