import {UserService} from "../../services/UserService";

async function addUserResolver(args) {
  const service = new UserService()
  return await service.create(args.user)
}

export const mutationResolvers = {
  Mutation: {
    addUser: (parent, args) => addUserResolver(args)
  }
}
