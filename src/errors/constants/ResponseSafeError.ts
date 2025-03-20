export interface IResponseSafeErrorObject {
  statusCode: number;
  code: string;
  message: string;
}

interface IResponseSafeError {
  INTERNAL_SERVER_ERROR: IResponseSafeErrorObject;
  BAD_REQUEST: IResponseSafeErrorObject;
  NOT_FOUND: IResponseSafeErrorObject;
  UNAUTHORIZED: IResponseSafeErrorObject;
}

export const ResponseSafeError: IResponseSafeError = {
  INTERNAL_SERVER_ERROR: {
    statusCode: 500,
    code: "INTERNAL_SERVER_ERROR",
    message: "An internal server error has occurred.",
  },
  BAD_REQUEST: {
    statusCode: 400,
    code: "BAD_REQUEST",
    message:
      "Provided request body is not valid. Please verify the schema, query fields, and syntax.",
  },
  NOT_FOUND: {
    statusCode: 404,
    code: "NOT_FOUND",
    message: "The specified resource does not exist.",
  },
  UNAUTHORIZED: {
    statusCode: 401,
    code: "UNAUTHORIZED",
    message: "You are not authorized to access this resource",
  },
} as const;
