import { IContext } from "../../context/IContext";

const userResolvers = {
  Mutation: {
    addUser: (_, args, { UserService }: IContext) =>
      UserService.addUser(
        args.user.first_name,
        args.user.last_name,
        args.user.email,
      ),

    deleteUser: (_, args, { UserService }: IContext) =>
      UserService.deleteUser(args.user_id),
  },
};

export default userResolvers;
