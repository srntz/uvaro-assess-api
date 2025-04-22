import { UnauthorizedError } from "../../errors/errors/UnauthorizedError";
import { IContextWithAuth } from "../../context/IContext";

/**
 * Checks if the request is authorized. It prevents unauthorized requests from accessing underlying resources.
 * @throws ```UnauthorizedError``` if the request is not authorized
 */
export const withAuthenticationRequired = (next) => {
  return (parent, args, context: IContextWithAuth, info) => {
    if (!context.AuthenticatedUser || !context.AuthenticatedUser.userId) {
      throw new UnauthorizedError();
    }

    return next(parent, args, context, info);
  };
};
