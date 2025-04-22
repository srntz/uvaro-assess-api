import { CategoryResponseDTO } from "../../dto/category/CategoryResponseDTO";

export interface ICategoryService {
  /**
   * Retrieves all categories
   * @returns ```Promise<CategoryResponseDTO[]>```
   */
  getAll(): Promise<CategoryResponseDTO[]>;

  /**
   * Retrieves category by the specified id
   * @param categoryId
   * @returns ```Promise<CategoryResponseDTO>``` or ```Promise<null>``` if the category does not exist
   */
  getById(categoryId: number): Promise<CategoryResponseDTO>;
}
