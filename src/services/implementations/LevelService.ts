import { ILevelService } from "../interfaces/ILevelService.js";
import { ILevelRepository } from "../../repositories/interfaces/ILevelRepository.js";
import { LevelResponseDTO } from "../../dto/level/LevelResponseDTO.js";
import { mapLevelEntityToLevelResponseDTO } from "../../mappers/level/mapLevelEntityToLevelResponseDTO.js";

export class LevelService implements ILevelService {
  constructor(private readonly levelRepository: ILevelRepository) {}

  async getLevelsByCategory(categoryId: number): Promise<LevelResponseDTO[]> {
    const levels = await this.levelRepository.getLevelsByCategory(categoryId);
    return levels.map((level) => mapLevelEntityToLevelResponseDTO(level));
  }
}
