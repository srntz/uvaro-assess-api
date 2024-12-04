import {configDotenv} from "dotenv";
import {ApolloServer} from "@apollo/server";
import {startStandaloneServer} from "@apollo/server/standalone";
import {buildSchema} from 'graphql'
import {graphqlString} from "./graphql";

configDotenv({path: "../.env"});

const schema = buildSchema(graphqlString);

const server = new ApolloServer({schema: schema});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});
