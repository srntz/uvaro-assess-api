import { LevelResponseDTO } from "../../dto/level/LevelResponseDTO";

export interface ILevelService {
  /**
   * Retrieves levels related to the specified category
   * @param categoryId
   * @returns ```Promise<LevelResponseDTO[]>```
   */
  getLevelsByCategory(categoryId: number): Promise<LevelResponseDTO[]>;
}
