import dotenv from "dotenv";
import { ApolloServer, ApolloServerPlugin } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import schema from "./graphql";
import cors from "cors";
import { ContextBuilder } from "./context/ContextBuilder";
import * as Sentry from "@sentry/node";
import { ApolloErrorHandler } from "./errors/handlers/ApolloErrorHandler";
import { responseHttpStatus } from "./errors/plugins/ResponseHttpStatus";
import { sentryErrorHandler } from "./errors/plugins/SentryErrorHandler";
import { EnvironmentLoader } from "./util/environmentLoader/EnvironmentLoader";

dotenv.config({ path: `.env.${EnvironmentLoader.load(process.argv)}` });

Sentry.init({
  dsn: process.env.SENTRY_DSN,
});

const app = express();

const context = ContextBuilder.Build();

const server = new ApolloServer({
  schema,
  formatError:
    process.env.ENABLE_SAFE_ERROR_HANDLING === "true"
      ? new ApolloErrorHandler().captureError
      : undefined,
  plugins: (() => {
    const plugins: ApolloServerPlugin[] = [];

    if (process.env.ENABLE_SAFE_ERROR_HANDLING === "true") {
      plugins.push(responseHttpStatus);
    }

    if (process.env.ENABLE_SENTRY === "true") {
      plugins.push(sentryErrorHandler);
    }

    return plugins;
  })(),
});

await server.start();

app.get("/error", () => {
  throw new Error("a");
});

app.use(cors());
app.use(express.json());
app.use(
  "/graphql",
  expressMiddleware(server, { context: async () => context }),
);

Sentry.setupExpressErrorHandler(app);

app.listen(4000, () => {
  console.log("Server started on port 4000");
});
