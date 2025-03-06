import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const schemaFiles = loadFilesSync(`${__dirname}/**/*.graphql`, {
  ignoreIndex: true,
});
const resolverFiles = loadFilesSync(`${__dirname}/resolvers/**/*.resolver.ts`, {
  ignoreIndex: true,
});

const typeDefs = mergeTypeDefs(schemaFiles);
const resolvers = mergeResolvers(resolverFiles);

const schema = makeExecutableSchema({ typeDefs, resolvers });
export default schema;
