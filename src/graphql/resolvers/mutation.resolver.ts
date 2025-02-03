import { UserService } from "../../services/UserService";
import { User } from "../../models/User";
import { IUser } from "../../db/schemas";

async function addUserResolver(userData: IUser) {
  const service = new UserService();

  const user = new User(userData);

  return await service.create(user);
}

// TODO: implement the method and enable eslint
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function addAssessmentResolver(userId) {}

export const mutationResolvers = {
  Mutation: {
    addUser: (_, args) => addUserResolver(args.user),
    addAssessment: (_, args) => addAssessmentResolver(args.user_id),
  },
};
