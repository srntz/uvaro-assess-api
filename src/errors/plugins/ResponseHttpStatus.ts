import { ApolloServerPlugin } from "@apollo/server";

/**
 * This plugin sets the response status code to the code passed by the error formatter
 * (default Apollo Server formatter or custom response-safe mapper) in the error body.
 */
export const responseHttpStatus: ApolloServerPlugin = {
  async requestDidStart() {
    return {
      async willSendResponse({ response }) {
        if (
          response.body.kind === "single" &&
          response.body.singleResult.errors
        ) {
          response.http.status = response.body.singleResult?.errors[0]
            ?.extensions.statusCode as number;
          delete response.body.singleResult.errors[0].extensions.statusCode;
          delete response.body.singleResult.data;
        }
      },
    };
  },
};
