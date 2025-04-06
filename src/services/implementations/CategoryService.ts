import { ICategoryService } from "../interfaces/ICategoryService.js";
import { ICategoryRepository } from "../../repositories/interfaces/ICategoryRepository.js";
import { CategoryResponseDTO } from "../../dto/category/CategoryResponseDTO.js";
import { mapCategoryEntityToCategoryResponseDTO } from "../../mappers/category/mapCategoryEntityToCategoryResponseDTO.js";

export class CategoryService implements ICategoryService {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async getAll(): Promise<CategoryResponseDTO[]> {
    return (await this.categoryRepository.getAll()).map((category) =>
      mapCategoryEntityToCategoryResponseDTO(category),
    );
  }

  async getById(id: number): Promise<CategoryResponseDTO> {
    return mapCategoryEntityToCategoryResponseDTO(
      await this.categoryRepository.getById(id),
    );
  }
}
