import { GraphQLError } from "graphql/error";

export class UnauthorizedError extends GraphQLError {
  constructor() {
    super("You are not authorized to access this resource", {
      extensions: { code: "UNAUTHORIZED" },
    });
  }
}
