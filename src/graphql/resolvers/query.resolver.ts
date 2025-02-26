import { CategoryService } from "../../services/CategoryService";
import { Service } from "../../services/Service";
import { Category } from "../../models/Category";

async function categoriesFieldResolver() {
  const service: Service<Category> = new CategoryService();
  return await service.getAll();
}

const queryResolvers = {
  Query: {
    allCategories: categoriesFieldResolver,
  },
};

export default queryResolvers;
