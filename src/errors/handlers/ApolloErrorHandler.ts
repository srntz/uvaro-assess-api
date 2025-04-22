import { GraphQLFormattedError } from "graphql";
import { ApolloServerErrorCodeExtended } from "../enums/ApolloServerErrorCodeExtended";
import { mapApolloServerErrorToResponseSafeError } from "../mappers/mapApolloServerErrorToResponseSafeError";

interface IProcessedError {
  message: string;
  extensions: {
    code: string;
    statusCode: number;
    timestamp: string;
  };
}

/**
 * This class is responsible for catching GraphQL errors and transforming them to client-safe format.
 *
 * If the underlying error hadnling modules behave unexpectedly, captureError() will return a generic error response
 */
export class ApolloErrorHandler {
  private formattedError: GraphQLFormattedError;

  private unexpectedError: IProcessedError = {
    message:
      "Could not process error details. This behaviour is unexpected. Please report or try again later.",
    extensions: {
      code: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      timestamp: null,
    },
  };

  public captureError = (
    formattedError: GraphQLFormattedError,
  ): GraphQLFormattedError => {
    this.formattedError = formattedError;

    const processedError: IProcessedError = {
      message: null,
      extensions: {
        code: null,
        statusCode: null,
        timestamp: null,
      },
    };

    const responseSafeError = mapApolloServerErrorToResponseSafeError(
      formattedError.extensions.code as ApolloServerErrorCodeExtended,
      formattedError.message,
    );

    try {
      this.message(processedError, responseSafeError.message)
        .code(processedError, responseSafeError.code)
        .statusCode(processedError, responseSafeError.statusCode)
        .timestamp(processedError);

      return processedError;
    } catch {
      return this.unexpectedError;
    }
  };

  private message = (
    error: IProcessedError,
    message?: string,
  ): ApolloErrorHandler => {
    if (message) {
      error.message = message;
    } else {
      error.message = this.formattedError.message;
    }

    return this;
  };

  private code = (error: IProcessedError, code: string) => {
    error.extensions.code = code;
    return this;
  };

  private statusCode = (error: IProcessedError, statusCode: number) => {
    error.extensions.statusCode = statusCode;
    return this;
  };

  private timestamp = (error: IProcessedError) => {
    error.extensions.timestamp = new Date().toISOString();
    return this;
  };
}
