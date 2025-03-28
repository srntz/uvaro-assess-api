import { UnauthorizedError } from "../../errors/errors/UnauthorizedError";

export const withAuthenticationRequired = (next) => {
  return (parent, args, context, info) => {
    if (!context.AuthenticatedUser || !context.AuthenticatedUser.user_id) {
      throw new UnauthorizedError();
    }

    return next(parent, args, context, info);
  };
};
