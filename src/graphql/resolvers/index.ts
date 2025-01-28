import {queryResolvers} from "./query.resolver";
import {categoryResolvers} from "./category.resolver";
import {questionResolvers} from "./question.resolver";
import {levelResolvers} from "./level.resolver";
import {answerResolvers} from "./answer.resolver";
import {mutationResolvers} from "./mutation.resolver";

export const resolvers = {
  ...queryResolvers,
  ...categoryResolvers,
  ...questionResolvers,
  ...levelResolvers,
  ...answerResolvers,
  ...mutationResolvers
}
