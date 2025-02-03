import { Level } from "../models/Level";
import { ILevel, level } from "../db/schemas";
import { eq } from "drizzle-orm";
import { Service } from "./Service";

export class LevelService extends Service<Level> {
  constructor() {
    super();
  }

  override async get(id: number): Promise<Level> {
    const data: ILevel[] = await this.db
      .select()
      .from(level)
      .where(eq(level.level_id, id));

    if (data.length > 0) {
      return new Level(data[0]);
    }

    return null;
  }

  override async getRelated(parentId: number): Promise<Level[]> {
    const relatedLevels: Level[] = [];

    const data: ILevel[] = await this.db
      .select()
      .from(level)
      .where(eq(level.category_id, parentId));

    data.forEach((item) => {
      relatedLevels.push(new Level(item));
    });

    return relatedLevels;
  }
}
