import { IContextWithAuth } from "../../context/IContext";
import { UnauthorizedError } from "../../errors/errors/UnauthorizedError";

const userResolvers = {
  Query: {
    getUser: async (
      _,
      __,
      { UserService, AuthenticatedUser }: IContextWithAuth,
    ) => {
      if (AuthenticatedUser.user_id === null) {
        throw new UnauthorizedError();
      }
      return await UserService.getById(AuthenticatedUser.user_id);
    },
  },
};

export default userResolvers;
