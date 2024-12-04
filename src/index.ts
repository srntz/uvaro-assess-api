import {configDotenv} from "dotenv";
import {ApolloServer} from "@apollo/server";
import {expressMiddleware} from "@apollo/server/express4";
import express from "express";
import {resolvers, typeDefs} from "./graphql";

configDotenv({path: "../.env"});

const app = express();

const server = new ApolloServer({typeDefs, resolvers});
await server.start();

app.use(express.json());
app.use("/graphql", expressMiddleware(server))

app.listen(3000, () => {
  console.log("Server started on port 3000");
})
