import { Category } from "../../models/Category";

export interface ICategoryRepository {
  /**
   * Retrieves all categories
   * @returns ```Promise<Category[]>```
   * @throws ```Error``` if the database transaction failed
   */
  getAll(): Promise<Category[]>;

  /**
   * Retrieves category by the specified id
   * @param categoryId
   * @returns ```Promise<Category>``` or ```Promise<null>``` if the category does not exist
   * @throws ```Error``` if the database transaction failed
   */
  getById(id: number): Promise<Category>;
}
