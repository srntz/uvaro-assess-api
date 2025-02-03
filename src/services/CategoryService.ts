import { category, ICategory } from "../db/schemas";
import { Category } from "../models/Category";
import { eq } from "drizzle-orm";
import { Service } from "./Service";

export class CategoryService extends Service<Category> {
  constructor() {
    super();
  }

  override async getAll(): Promise<Category[]> {
    const categories: Category[] = [];
    const data: ICategory[] = await this.db.select().from(category);

    data.forEach((item) => {
      categories.push(new Category(item));
    });

    return categories;
  }

  override async get(id: number): Promise<Category> {
    const data: ICategory[] = await this.db
      .select()
      .from(category)
      .where(eq(category.category_id, id));

    if (data.length > 0) {
      return new Category(data[0]);
    }

    return null;
  }
}
