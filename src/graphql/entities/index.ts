import {categoryEntity} from "./category.graphql";
import {questionEntity} from "./question.graphql";
import {levelEntity} from "./level.graphql";
import {answerEntity} from "./answer.graphql";
import {queryEntity} from "./query.graphql";
import {userEntity} from "./user.graphql";
import {mutationEntity} from "./mutation.graphql";

export const typeDefs =
  `
    ${categoryEntity} 
    ${questionEntity} 
    ${levelEntity} 
    ${answerEntity}
    ${queryEntity}
    ${userEntity}
    ${mutationEntity}
  `;
