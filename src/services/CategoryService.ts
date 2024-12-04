import {DatabaseConnection} from "../db/DatabaseConnection";
import {category, CategoryType, ICategory} from "../db/schemas";
import {Category} from "../models/Category";

export class CategoryService {
  private db;

  constructor() {
    this.db = DatabaseConnection.getInstance();
  }

  public async getCategories(): Promise<ICategory[]> {
    const categories: ICategory[] = []
    const data: CategoryType[] = await this.db.select().from(category);

    data.forEach((item) => {
      const category = new Category();
      category.category_id = item.category_id;
      category.category_name = item.category_name;

      categories.push(category);
    })

    return categories;
  }
}

