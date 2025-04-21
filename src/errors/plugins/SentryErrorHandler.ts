import { ApolloServerPlugin } from "@apollo/server";
import * as Sentry from "@sentry/node";

/**
 * This plugin catches internal errors and sends raw error data to Sentry.
 *
 * Errors will not get sent if an operation has not been initialized since such errors are not related to internal API functionality
 */
export const sentryErrorHandler: ApolloServerPlugin = {
  async requestDidStart() {
    return {
      async didEncounterErrors(context) {
        if (!context.operation) {
          return;
        }

        for (let i = 0; i < context.errors.length; i++) {
          Sentry.withScope((scope) => {
            scope.setTag("operation", context.operation.operation);
            scope.setExtra("query", context.request.query);
            scope.setExtra("variables", context.request.variables);
            if (context.errors[i].path) {
              scope.addBreadcrumb({
                category: "query-path",
                message: context.errors[i].path.join(" > "),
              });
            }
            Sentry.captureException(context.errors[i]);
          });
        }
      },
    };
  },
};
