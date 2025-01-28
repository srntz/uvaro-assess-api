import {Level} from "../models/Level";
import {ILevel, level} from "../db/schemas";
import {eq} from "drizzle-orm";
import {Service} from "./Service";

export class LevelService extends Service<ILevel> {
  constructor() {
    super();
  }

  override async get(id: number): Promise<ILevel> {
    const data: ILevel[] = await this.db.select().from(level).where(eq(level.level_id, id));

    if(data.length > 0) {
      return new Level(data[0].level_id, data[0].level_name, data[0].level_statement, data[0].required_weighting, data[0].category_id)
    }

    return null
  }

  override async getRelated(parentId: number): Promise<ILevel[]> {
    const relatedLevels: ILevel[] = [];

    const data: ILevel[] = await this.db.select().from(level).where(eq(level.category_id, parentId));

    data.forEach((item) => {
      relatedLevels.push(new Level(item.level_id,
                                  item.level_name,
                                  item.level_statement,
                                  item.required_weighting,
                                  item.category_id));
    })

    return relatedLevels;
  }
}
