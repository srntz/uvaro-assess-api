import { Level } from "../../models/Level";
import { IContext } from "../../context/IContext";

const levelResolvers = {
  Level: {
    category: async (parent: Level, _, { CategoryService }: IContext) => {
      return await CategoryService.getById(parent.category_id);
    },
  },
};

export default levelResolvers;
