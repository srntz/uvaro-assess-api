import dotenv from "dotenv";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import { resolvers, typeDefs } from "./graphql";
import cors from "cors";

dotenv.config();

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});
await server.start();

app.use(cors());
app.use(express.json());
app.use("/graphql", expressMiddleware(server));

app.listen(4000, () => {
  console.log("Server started on port 4000");
});
