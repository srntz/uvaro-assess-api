import {configDotenv} from "dotenv";
import {ApolloServer} from "@apollo/server";
import {buildSchema} from 'graphql'
import {graphqlString} from "./graphql";
import {expressMiddleware} from "@apollo/server/express4";
import express from "express";

configDotenv({path: "../.env"});

const app = express();

const schema = buildSchema(graphqlString);

const server = new ApolloServer({schema: schema});
await server.start();

app.use(express.json());
app.use("/graphql", expressMiddleware(server))

app.listen(3000, () => {
  console.log("Server started on port 3000");
})
