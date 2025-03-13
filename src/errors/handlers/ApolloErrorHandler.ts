import { GraphQLFormattedError } from "graphql/error";
import { ApolloServerErrorCodeExtended } from "../enums/ApolloServerErrorCodeExtended";
import { mapApolloServerErrorToResponseSafeError } from "../mappers/mapApolloServerErrorToResponseSafeError";

export class ApolloErrorHandler {
  private formattedError: GraphQLFormattedError;
  private processedError = {
    message:
      "Could not process error details. This behaviour is unexpected. Please report or try again later.",
    extensions: {
      code: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
    },
  };

  public captureError = (
    formattedError: GraphQLFormattedError,
  ): GraphQLFormattedError => {
    this.formattedError = formattedError;

    const responseSafeError = mapApolloServerErrorToResponseSafeError(
      formattedError.extensions.code as ApolloServerErrorCodeExtended,
    );

    this.message(responseSafeError.message)
      .code(responseSafeError.code)
      .statusCode(responseSafeError.statusCode)
      .timestamp();

    return this.processedError;
  };

  private message = (message?: string): ApolloErrorHandler => {
    if (message) {
      this.processedError.message = message;
    } else {
      this.processedError.message = this.formattedError.message;
    }

    return this;
  };

  private code = (code: string) => {
    this.processedError.extensions.code = code;
    return this;
  };

  private statusCode = (statusCode: number) => {
    this.processedError.extensions.statusCode = statusCode;
    return this;
  };

  private timestamp = () => {
    Object(this.processedError.extensions).timestamp = new Date().toISOString();
    return this;
  };
}
