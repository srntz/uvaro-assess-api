import { Repository } from "../base/Repository";
import { ICategoryRepository } from "../interfaces/ICategoryRepository";
import { Category } from "../../models/Category";
import { category } from "../../db/schemas";
import { eq } from "drizzle-orm";

export class CategoryRepository
  extends Repository
  implements ICategoryRepository
{
  async getAll(): Promise<Category[]> {
    const categories: Category[] = [];

    const data: (typeof category.$inferSelect)[] = await this.db
      .select()
      .from(category);

    data.forEach((item) => {
      categories.push(Category.init(item));
    });

    return categories;
  }

  async getById(id: number): Promise<Category> {
    const data: (typeof category.$inferSelect)[] = await this.db
      .select()
      .from(category)
      .where(eq(category.category_id, id));

    if (data.length > 0) {
      return Category.init(data[0]);
    }

    return null;
  }
}
