import { UserService } from "../../services/UserService";
import { User } from "../../models/User";
import { IUser } from "../../db/schemas";

async function addUserResolver(userData: IUser) {
  const service = new UserService();

  const user = new User(userData);

  return await service.create(user);
}

const mutationResolvers = {
  Mutation: {
    addUser: (_, args) => addUserResolver(args.user),
  },
};

export default mutationResolvers;
