import dotenv from "dotenv";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import schema from "./graphql";
import cors from "cors";
import { ContextBuilder } from "./context/ContextBuilder";

dotenv.config();

const app = express();

const context = ContextBuilder.Build();

const server = new ApolloServer({
  schema,
});
await server.start();

app.use(cors());
app.use(express.json());
app.use(
  "/graphql",
  expressMiddleware(server, { context: async () => context }),
);

app.listen(4000, () => {
  console.log("Server started on port 4000");
});
