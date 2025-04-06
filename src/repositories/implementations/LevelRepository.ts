import { ILevelRepository } from "../interfaces/ILevelRepository.js";
import { Level } from "../../models/Level.js";
import { Repository } from "../base/Repository.js";
import { level } from "../../db/schemas/index.js";
import { eq } from "drizzle-orm";
import { LevelWithWeightingDTO } from "../../dto/level/LevelWithWeightingDTO.js";
import { weighting } from "../../db/schemas/weighting.js";

export class LevelRepository extends Repository implements ILevelRepository {
  async getLevelsByCategory(categoryId: number): Promise<Level[]> {
    const relatedLevels: Level[] = [];

    const data: (typeof level.$inferSelect)[] = await this.db
      .select()
      .from(level)
      .where(eq(level.category_id, categoryId));

    data.forEach((item) => {
      relatedLevels.push(Level.init(item));
    });

    return relatedLevels;
  }

  async getLevelsWithWeightingByCategoryId(
    categoryId: number,
  ): Promise<LevelWithWeightingDTO[]> {
    const levels: LevelWithWeightingDTO[] = [];

    const data: {
      level: typeof level.$inferSelect;
      weighting: typeof weighting.$inferSelect;
    }[] = await this.db
      .select()
      .from(level)
      .leftJoin(weighting, eq(level.weighting_id, weighting.weighting_id))
      .where(eq(level.category_id, categoryId));

    data.forEach((item) => {
      levels.push(
        new LevelWithWeightingDTO(
          item.level.level_name,
          item.level.level_statement,
          item.weighting.weighting,
          item.level.weighting_id,
          item.level.category_id,
          item.level.level_id,
        ),
      );
    });

    return levels;
  }

  async getLevelById(levelId: number): Promise<Level> {
    const data = await this.db
      .select()
      .from(level)
      .where(eq(level.level_id, levelId));

    return Level.init(data[0]);
  }
}
