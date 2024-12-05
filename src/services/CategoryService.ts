import {DatabaseConnection} from "../db/DatabaseConnection";
import {category, CategoryType, ICategory} from "../db/schemas";
import {Category} from "../models/Category";
import {IService} from "../interfaces/IService";
import {eq} from "drizzle-orm";

export class CategoryService implements IService<ICategory> {
  private db;

  constructor() {
    this.db = DatabaseConnection.getInstance();
  }

  async getAll(): Promise<ICategory[]> {
    const categories: ICategory[] = []
    const data: CategoryType[] = await this.db.select().from(category);

    data.forEach((item) => {
      categories.push(new Category(item.category_id, item.category_name));
    })

    return categories;
  }

  async get(id: number): Promise<ICategory> {
    const data = await this.db.select().from(category).where(eq(category.category_id, id));

    if(data.length > 0) {
      return new Category(data[0].category_id, data[0].category_name);
    }

    return null
  }
}

