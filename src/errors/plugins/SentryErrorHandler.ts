import { ApolloServerPlugin } from "@apollo/server";

export const sentryErrorHandler: ApolloServerPlugin = {
  async requestDidStart() {
    return {
      async didEncounterErrors(context) {
        console.log(context);
      },
    };
  },
};
