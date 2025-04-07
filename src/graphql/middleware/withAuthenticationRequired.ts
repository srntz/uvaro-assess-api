import { UnauthorizedError } from "../../errors/errors/UnauthorizedError";
import { IContextWithAuth } from "../../context/IContext";

export const withAuthenticationRequired = (next) => {
  return (parent, args, context: IContextWithAuth, info) => {
    if (!context.AuthenticatedUser || !context.AuthenticatedUser.userId) {
      throw new UnauthorizedError();
    }

    return next(parent, args, context, info);
  };
};
