import { category } from "../db/schemas";

export class Category {
  constructor(
    readonly category_id: number,
    readonly category_name: string,
    readonly category_description: string,
    readonly category_image: string,
  ) {}

  static init(data: typeof category.$inferSelect) {
    try {
      return new Category(
        data.category_id,
        data.category_name,
        data.category_description,
        data.category_image,
      );
    } catch {
      return null;
    }
  }
}
