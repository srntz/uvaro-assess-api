import { Level } from "../../models/Level";
import { LevelWithWeightingDTO } from "../../dto/level/LevelWithWeightingDTO";

export interface ILevelRepository {
  getLevelsByCategory(categoryId: number): Promise<Level[]>;
  getLevelById(levelId: number): Promise<Level>;
  getLevelsWithWeightingByCategoryId(
    categoryId: number,
  ): Promise<LevelWithWeightingDTO[]>;
}
