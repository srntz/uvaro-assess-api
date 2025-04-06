import { LevelResponseDTO } from "../../dto/level/LevelResponseDTO.js";

export interface ILevelService {
  getLevelsByCategory(categoryId: number): Promise<LevelResponseDTO[]>;
}
