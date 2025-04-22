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

// Environment is loaded and the return string is passed to dotenv to determine the correct .env file for the given environment
dotenv.config({ path: `.env.${EnvironmentLoader.load(process.argv)}` });

// Loads the passport-saml configuration. This enables authentication flows and prepares the API for communication with the external IdP.
PassportStrategyConfig.configure();

// Initializes Sentry client
Sentry.init({
  dsn: process.env.SENTRY_DSN,
});

const app = express();

// Loads the base context.
let context = ContextBuilder.build();

// Creates an instance of Apollo Server. Determines plugins based on the options from .env
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

// Spins up the GraphQL server. This is a required step before passing the server to express.
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

// Attaches the AuthRouter to the express instance.
app.use("/", AuthRouter);

// Attaches the GraphQL (Apollo) server to the express instance.
app.use(
  "/graphql",
  (req, res, next) => {
    context = ContextBuilder.injectAuthenticatedUser(req, res, context);
    next();
  },
  expressMiddleware(server, {
    context: async () => {
      return context;
    },
  }),
);

// Attaches the Sentry middleware to the express instance. This will catch and log all errors thrown outside of the GraphQL server.
Sentry.setupExpressErrorHandler(app);

app.listen(4000, "0.0.0.0", () => {
  console.log("Server started on port 4000");
});
