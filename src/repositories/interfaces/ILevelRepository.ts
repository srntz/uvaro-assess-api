import { Level } from "../../models/Level";
import { LevelWithWeightingDTO } from "../../dto/level/LevelWithWeightingDTO";

export interface ILevelRepository {
  /**
   * Retrieves levels related to the specified category
   * @param categoryId
   * @returns ```Promise<Level[]>```
   */
  getLevelsByCategory(categoryId: number): Promise<Level[]>;

  /**
   * Retrieves a level by the provided id
   * @param levelId
   * @returns ```Promise<Level>``` or ```Promise<null>``` if the level does not exist
   */
  getLevelById(levelId: number): Promise<Level>;

  /**
   * Retrieves levels related to the specified category with their respective weightings and weightingIds injected into the response object
   * @param categoryId
   * @returns ```Promise<LevelWithWeightingDTO[]>```
   */
  getLevelsWithWeightingByCategoryId(
    categoryId: number,
  ): Promise<LevelWithWeightingDTO[]>;
}
