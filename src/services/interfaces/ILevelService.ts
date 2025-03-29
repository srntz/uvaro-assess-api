import { LevelResponseDTO } from "../../dto/level/LevelResponseDTO";

export interface ILevelService {
  getLevelsByCategory(categoryId: number): Promise<LevelResponseDTO[]>;
}
