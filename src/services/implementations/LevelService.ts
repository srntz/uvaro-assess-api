import { ILevelService } from "../interfaces/ILevelService";
import { Level } from "../../models/Level";
import { ILevelRepository } from "../../repositories/interfaces/ILevelRepository";

export class LevelService implements ILevelService {
  constructor(private readonly levelRepository: ILevelRepository) {}

  async getLevelsByCategory(categoryId: number): Promise<Level[]> {
    return await this.levelRepository.getLevelsByCategory(categoryId);
  }
}
