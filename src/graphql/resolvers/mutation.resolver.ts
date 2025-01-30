import {UserService} from "../../services/UserService";
import {User} from "../../models/User";
import {IUser} from "../../db/schemas";

async function addUserResolver(userData: IUser) {
  const service = new UserService()

  const user = new User(userData)

  return await service.create(user)
}

async function addAssessmentResolver(userId) {

}

export const mutationResolvers = {
  Mutation: {
    addUser: (parent, args) => addUserResolver(args.user),
    addAssessment: (parent, args) => addAssessmentResolver(args.user_id)
  }
}
