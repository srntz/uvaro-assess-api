import {typedefs} from "./typedefs";
import {queryType} from "./query";

export const graphqlString = `${typedefs} ${queryType}`;
