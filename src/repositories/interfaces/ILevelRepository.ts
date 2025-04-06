import { Level } from "../../models/Level.js";
import { LevelWithWeightingDTO } from "../../dto/level/LevelWithWeightingDTO.js";

export interface ILevelRepository {
  getLevelsByCategory(categoryId: number): Promise<Level[]>;
  getLevelById(levelId: number): Promise<Level>;
  getLevelsWithWeightingByCategoryId(
    categoryId: number,
  ): Promise<LevelWithWeightingDTO[]>;
}
