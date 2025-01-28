import {UserService} from "../../services/UserService";
import {User} from "../../models/User";

async function addUserResolver(userData) {
  const service = new UserService()

  const user = User.instantiateFromSourceData(userData)

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
