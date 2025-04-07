import { CategoryResponseDTO } from "../../dto/category/CategoryResponseDTO";

export interface ICategoryService {
  getAll(): Promise<CategoryResponseDTO[]>;
  getById(id: number): Promise<CategoryResponseDTO>;
}
