import { ApolloServerPlugin } from "@apollo/server";

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
