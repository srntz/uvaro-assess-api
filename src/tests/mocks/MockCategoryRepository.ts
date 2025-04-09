import { ICategoryRepository } from "../../repositories/interfaces/ICategoryRepository";
import { Category } from "../../models/Category";

export class MockCategoryRepository implements ICategoryRepository {
  readonly storage = new Map<number, Category>([
    [
      1,
      new Category(
        1,
        "Category 1",
        "Category 1 description",
        "https://example.com",
      ),
    ],
    [
      2,
      new Category(
        2,
        "Category 2",
        "Category 2 description",
        "https://example.com",
      ),
    ],
  ]);

  async getAll(): Promise<Category[]> {
    return Array.from(this.storage.values());
  }

  async getById(id: number): Promise<Category> {
    const category = this.storage.get(id);

    if (category) {
      return category;
    }

    return null;
  }
}
