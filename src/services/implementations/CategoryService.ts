import { ICategoryService } from "../interfaces/ICategoryService";
import { ICategoryRepository } from "../../repositories/interfaces/ICategoryRepository";
import { CategoryResponseDTO } from "../../dto/category/CategoryResponseDTO";
import { mapCategoryEntityToCategoryResponseDTO } from "../../mappers/category/mapCategoryEntityToCategoryResponseDTO";

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
