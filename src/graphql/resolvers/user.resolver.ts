import { IContextWithAuth } from "../../context/IContext.js";
import { withAuthenticationRequired } from "../middleware/withAuthenticationRequired.js";

const userResolvers = {
  Query: {
    getUser: withAuthenticationRequired(
      async (_, __, { UserService, AuthenticatedUser }: IContextWithAuth) => {
        return await UserService.getById(AuthenticatedUser.userId);
      },
    ),
  },
};

export default userResolvers;
