import { ApolloServerErrorCodeExtended } from "../enums/ApolloServerErrorCodeExtended";
import {
  IResponseSafeErrorObject,
  ResponseSafeError,
} from "../constants/ResponseSafeError";

export function mapApolloServerErrorToResponseSafeError(
  errorCode: ApolloServerErrorCodeExtended,
): IResponseSafeErrorObject {
  switch (errorCode) {
    case ApolloServerErrorCodeExtended.BAD_USER_INPUT:
    case ApolloServerErrorCodeExtended.BAD_REQUEST:
    case ApolloServerErrorCodeExtended.GRAPHQL_PARSE_FAILED:
      return ResponseSafeError.BAD_REQUEST;

    case ApolloServerErrorCodeExtended.GRAPHQL_VALIDATION_FAILED:
    case ApolloServerErrorCodeExtended.PERSISTED_QUERY_NOT_FOUND:
    case ApolloServerErrorCodeExtended.PERSISTED_QUERY_NOT_SUPPORTED:
      return ResponseSafeError.NOT_FOUND;

    default:
      return ResponseSafeError.INTERNAL_SERVER_ERROR;
  }
}
