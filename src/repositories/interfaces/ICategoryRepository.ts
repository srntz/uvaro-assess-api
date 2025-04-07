import { Category } from "../../models/Category";

export interface ICategoryRepository {
  getAll(): Promise<Category[]>;
  getById(id: number): Promise<Category>;
}
