import { IContextWithAuth } from "../../context/IContext";
import { withAuthenticationRequired } from "../middleware/withAuthenticationRequired";

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
