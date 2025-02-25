import { ILevelRepository } from "../interfaces/ILevelRepository";
import { Level } from "../../models/Level";
import { Repository } from "../base/Repository";
import { ILevel, level } from "../../db/schemas";
import { eq } from "drizzle-orm";

export class LevelRepository extends Repository implements ILevelRepository {
  async getLevelsByCategory(categoryId: number): Promise<Level[]> {
    const relatedLevels: Level[] = [];

    const data: ILevel[] = await this.db
      .select()
      .from(level)
      .where(eq(level.category_id, categoryId));

    data.forEach((item) => {
      relatedLevels.push(Level.init(item));
    });

    return relatedLevels;
  }

  async getLevelById(levelId: number): Promise<Level> {
    const data = await this.db
      .select()
      .from(level)
      .where(eq(level.level_id, levelId));

    return Level.init(data[0]);
  }
}
