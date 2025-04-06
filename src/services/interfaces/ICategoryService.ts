import { CategoryResponseDTO } from "../../dto/category/CategoryResponseDTO.js";

export interface ICategoryService {
  getAll(): Promise<CategoryResponseDTO[]>;
  getById(id: number): Promise<CategoryResponseDTO>;
}
