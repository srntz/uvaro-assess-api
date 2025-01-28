import {UserService} from "../../services/UserService";
import {User} from "../../models/User";

async function addUserResolver(args) {
  const service = new UserService()

  const user = User.instantiateFromSourceData(args.user)

  return await service.create(user)
}

export const mutationResolvers = {
  Mutation: {
    addUser: (parent, args) => addUserResolver(args)
  }
}
