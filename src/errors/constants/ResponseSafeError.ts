export interface IResponseSafeErrorObject {
  statusCode: number;
  code: string;
  message: string;
}

export class ResponseSafeError {
  private static construct(
    error: IResponseSafeErrorObject,
    message: string | undefined,
  ): IResponseSafeErrorObject {
    if (message) {
      return {
        ...error,
        message,
      };
    }

    return error;
  }

  static InternalServerError = (message?: string) => {
    return this.construct(
      {
        statusCode: 500,
        code: "INTERNAL_SERVER_ERROR",
        message: "An internal server error has occurred.",
      },
      message,
    );
  };

  static BadRequest = (message?: string) => {
    return this.construct(
      {
        statusCode: 400,
        code: "BAD REQUEST",
        message:
          "The format of the provided request body or inner fields is invalid.",
      },
      message,
    );
  };

  static NotFound = (message?: string) => {
    return this.construct(
      {
        statusCode: 404,
        code: "NOT_FOUND",
        message: "The specified resource does not exist.",
      },
      message,
    );
  };

  static Unauthorized = (message?: string) => {
    return this.construct(
      {
        statusCode: 401,
        code: "UNAUTHORIZED",
        message: "You are not authorized to access this resource",
      },
      message,
    );
  };
}
