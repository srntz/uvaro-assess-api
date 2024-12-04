import {entities} from "./entities";
import {queryType} from "./query";
export * from './resolvers'

export const typeDefs = `${entities} ${queryType}`;
