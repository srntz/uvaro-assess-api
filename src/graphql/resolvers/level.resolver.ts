import { CategoryService } from "../../services/CategoryService";
import { Level } from "../../models/Level";

async function categoryFieldResolver(parent: Level) {
  const service = new CategoryService();
  return await service.get(parent.category_id);
}

const levelResolvers = {
  Level: {
    category: (parent: Level) => categoryFieldResolver(parent),
  },
};

export default levelResolvers;
