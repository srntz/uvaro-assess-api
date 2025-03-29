import { ILevelService } from "../interfaces/ILevelService";
import { ILevelRepository } from "../../repositories/interfaces/ILevelRepository";
import { LevelResponseDTO } from "../../dto/level/LevelResponseDTO";
import { mapLevelEntityToLevelResponseDTO } from "../../mappers/level/mapLevelEntityToLevelResponseDTO";

export class LevelService implements ILevelService {
  constructor(private readonly levelRepository: ILevelRepository) {}

  async getLevelsByCategory(categoryId: number): Promise<LevelResponseDTO[]> {
    const levels = await this.levelRepository.getLevelsByCategory(categoryId);
    return levels.map((level) => mapLevelEntityToLevelResponseDTO(level));
  }
}
