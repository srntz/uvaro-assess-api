import { ApolloServerErrorCodeExtended } from "../enums/ApolloServerErrorCodeExtended";
import {
  IResponseSafeErrorObject,
  ResponseSafeError,
} from "../constants/ResponseSafeError.js";

export function mapApolloServerErrorToResponseSafeError(
  errorCode: ApolloServerErrorCodeExtended,
  message: string,
): IResponseSafeErrorObject {
  switch (errorCode) {
    case ApolloServerErrorCodeExtended.BAD_USER_INPUT:
    case ApolloServerErrorCodeExtended.BAD_REQUEST:
    case ApolloServerErrorCodeExtended.GRAPHQL_PARSE_FAILED:
      return ResponseSafeError.BadRequest();
    case ApolloServerErrorCodeExtended.BAD_REQUEST_WITH_MESSAGE:
      return ResponseSafeError.BadRequest(message);

    case ApolloServerErrorCodeExtended.GRAPHQL_VALIDATION_FAILED:
    case ApolloServerErrorCodeExtended.PERSISTED_QUERY_NOT_FOUND:
    case ApolloServerErrorCodeExtended.PERSISTED_QUERY_NOT_SUPPORTED:
    case ApolloServerErrorCodeExtended.NOT_FOUND:
      return ResponseSafeError.NotFound();
    case ApolloServerErrorCodeExtended.NOT_FOUND_WITH_MESSAGE:
      return ResponseSafeError.NotFound(message);

    case ApolloServerErrorCodeExtended.UNAUTHORIZED:
      return ResponseSafeError.Unauthorized();
    case ApolloServerErrorCodeExtended.UNAUTHORIZED_WITH_MESSAGE:
      return ResponseSafeError.Unauthorized(message);

    case ApolloServerErrorCodeExtended.INTERNAL_SERVER_ERROR_WITH_MESSAGE:
      return ResponseSafeError.InternalServerError(message);

    default:
      return ResponseSafeError.InternalServerError();
  }
}
