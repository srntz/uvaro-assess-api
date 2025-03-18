import { Repository } from "../base/Repository";
import { ICategoryRepository } from "../interfaces/ICategoryRepository";
import { Category } from "../../models/Category";
import { category, ICategory } from "../../db/schemas";
import { eq } from "drizzle-orm";

export class CategoryRepository
  extends Repository
  implements ICategoryRepository
{
  async getAll(): Promise<Category[]> {
    const categories: Category[] = [];
    const data: ICategory[] = await this.db.select().from(category);

    data.forEach((item) => {
      categories.push(new Category(item));
    });

    return categories;
  }

  async getById(id: number): Promise<Category> {
    const data: ICategory[] = await this.db
      .select()
      .from(category)
      .where(eq(category.category_id, id));

    if (data.length > 0) {
      return new Category(data[0]);
    }

    return null;
  }

  async getAllIds(): Promise<{ category_id: number }[]> {
    return await this.db
      .select({
        category_id: category.category_id,
      })
      .from(category);
  }
}
