import { assessment } from "../db/schemas/index.js";
import { InvalidModelConstructionException } from "../errors/InvalidModelConstructionException.js";

export class Assessment {
  constructor(
    readonly assessment_id: number,
    readonly start_date_time: Date,
    readonly end_date_time: Date,
    readonly user_id: string,
  ) {}

  static init(data: typeof assessment.$inferSelect) {
    try {
      return new Assessment(
        data.assessment_id,
        data.start_date_time,
        data.end_date_time,
        data.user_id,
      );
    } catch {
      throw new InvalidModelConstructionException(
        Object.getPrototypeOf(this).constructor.name,
      );
    }
  }
}
