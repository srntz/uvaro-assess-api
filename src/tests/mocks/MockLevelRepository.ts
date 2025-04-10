import { ILevelRepository } from "../../repositories/interfaces/ILevelRepository";
import { Level } from "../../models/Level";
import { LevelWithWeightingDTO } from "../../dto/level/LevelWithWeightingDTO";

export class MockLevelRepository implements ILevelRepository {
  readonly storage = new Map<number, Level>([
    [
      1, 
      new Level(
        "Beginner",
        "Starting level",
        "beginner.jpg",
        1,
        1,
        1
      )
    ],
    [
      2,
      new Level(
        "Intermediate",
        "Mid level",
        "intermediate.jpg",
        2,
        1,
        2
      )
    ],
    [
      3,
      new Level(
        "Advanced",
        "Expert level",
        "advanced.jpg",
        3,
        2,
        3
      )
    ]
  ]);

  async getLevelsByCategory(categoryId: number): Promise<Level[]> {
    return Array.from(this.storage.values()).filter(
      level => level.category_id === categoryId
    );
  }

  async getLevelById(levelId: number): Promise<Level> {
    return this.storage.get(levelId) || null;
  }

  async getLevelsWithWeightingByCategoryId(
    categoryId: number
  ): Promise<LevelWithWeightingDTO[]> {
    const levels = await this.getLevelsByCategory(categoryId);
    return levels.map(level => ({
      level_id: level.level_id,
      level_name: level.level_name,
      level_statement: level.level_statement,
      level_image: level.level_image,
      weighting_id: level.weighting_id,
      category_id: level.category_id,
      weighting: 0.5 // Mock weighting value
    }));
  }
}