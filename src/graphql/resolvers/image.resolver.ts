import { IContext } from "../../context/IContext";

const imageResolvers = {
  Query: {
    async getImagesByPage(_, args, { ImageService }: IContext) {
      return await ImageService.getImagesByPage(args.page);
    },
  },
};

export default imageResolvers;
