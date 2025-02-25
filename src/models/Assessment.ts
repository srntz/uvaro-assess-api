import { BaseModel } from "./BaseModel";
import { IAssessment } from "../db/schemas";
import { InvalidModelConstructionException } from "../errors/InvalidModelConstructionException";

export class Assessment implements BaseModel<IAssessment> {
  readonly id: number | undefined;
  readonly start_date_time: Date | undefined;
  readonly end_date_time: Date | undefined;
  readonly user_id: string;

  constructor(data: IAssessment) {
    try {
      this.id = data.assessment_id;
      this.start_date_time = data.start_date_time;
      this.end_date_time = data.end_date_time;
      this.user_id = data.user_id;
    } catch {
      throw new InvalidModelConstructionException(
        Object.getPrototypeOf(this).constructor.name,
      );
    }
  }

  createFullJsonObject() {
    return {
      assessment_id: this.id,
      start_date_time: this.start_date_time,
      end_date_time: this.end_date_time,
      user_id: this.user_id,
    };
  }

  createInsertableJsonObject() {
    return {
      start_date_time: this.start_date_time,
      end_date_time: this.end_date_time,
      user_id: this.user_id,
    };
  }
}
