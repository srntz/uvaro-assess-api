import { ICategoryService } from "../interfaces/ICategoryService";
import { Category } from "../../models/Category";
import { ICategoryRepository } from "../../repositories/interfaces/ICategoryRepository";

export class CategoryService implements ICategoryService {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async getAll(): Promise<Category[]> {
    return await this.categoryRepository.getAll();
  }

  async getById(id: number): Promise<Category> {
    return await this.categoryRepository.getById(id);
  }
}
