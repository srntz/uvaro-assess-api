import { IContext } from "../../context/IContext";

const mutationResolvers = {
  Mutation: {
    addUser: (_, args, { UserService }: IContext) =>
      UserService.addUser(
        args.user.first_name,
        args.user.last_name,
        args.user.email,
      ),
  },
};

export default mutationResolvers;
