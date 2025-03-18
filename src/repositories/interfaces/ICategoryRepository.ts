import { Category } from "../../models/Category";

export interface ICategoryRepository {
  getAll(): Promise<Category[]>;
  getAllIds(): Promise<{ category_id: number }[]>;
  getById(id: number): Promise<Category>;
}
