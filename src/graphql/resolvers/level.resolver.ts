import {CategoryService} from "../../services/CategoryService";

async function categoryFieldResolver(parent: any) {
  const service = new CategoryService();
  return await service.get(parent.category_id);
}

export const levelResolvers = {
  Level: {
    category: (parent) => categoryFieldResolver(parent),
  }
}
