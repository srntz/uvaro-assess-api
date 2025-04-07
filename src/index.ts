import dotenv from "dotenv";
import { ApolloServer, ApolloServerPlugin } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import schema from "./graphql";
import cors from "cors";
import { ContextBuilder } from "./context/ContextBuilder";
import { PassportStrategyConfig } from "./configs/PassportStrategyConfig";
import { AuthRouter } from "./routes/auth/AuthRouter";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import * as Sentry from "@sentry/node";
import { ApolloErrorHandler } from "./errors/handlers/ApolloErrorHandler";
import { responseHttpStatus } from "./errors/plugins/ResponseHttpStatus";
import { sentryErrorHandler } from "./errors/plugins/SentryErrorHandler";
import { EnvironmentLoader } from "./utils/environmentLoader/EnvironmentLoader";

dotenv.config({ path: `.env.${EnvironmentLoader.load(process.argv)}` });
PassportStrategyConfig.configure();

Sentry.init({
  dsn: process.env.SENTRY_DSN,
});

const app = express();

let context = ContextBuilder.Build();

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

app.use(
  cors({
    origin: process.env.CORS_ALLOWED_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use("/", AuthRouter);

app.use(
  "/graphql",
  (req, res, next) => {
    context = ContextBuilder.ParseTokens(req, res, context);
    next();
  },
  expressMiddleware(server, {
    context: async () => {
      return context;
    },
  }),
);

Sentry.setupExpressErrorHandler(app);

app.listen(4000, "0.0.0.0", () => {
  console.log("Server started on port 4000");
});
