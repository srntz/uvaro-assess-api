import { BaseModel } from "./BaseModel";
import { IAssessment } from "../db/schemas";
import { InvalidModelConstructionException } from "../errors/InvalidModelConstructionException";

export class Assessment implements BaseModel<IAssessment> {
  readonly assessment_id: number | undefined;
  readonly start_date_time: Date;
  readonly end_date_time: Date | undefined;
  readonly notes: string;
  readonly user_id: string;

  constructor(data: IAssessment) {
    try {
      this.assessment_id = data.assessment_id;
      this.start_date_time = data.start_date_time;
      this.end_date_time = data.end_date_time;
      this.notes = data.notes;
      this.user_id = data.user_id;
    } catch (e) {
      throw new InvalidModelConstructionException(
        Object.getPrototypeOf(this).constructor.name,
      );
    }
  }

  createFullJsonObject() {
    return {
      assessment_id: this.assessment_id,
      start_date_time: this.start_date_time,
      end_date_time: this.end_date_time,
      notes: this.notes,
      user_id: this.user_id,
    };
  }

  createInsertableJsonObject() {
    return {
      start_date_time: this.start_date_time,
      end_date_time: this.end_date_time,
      notes: this.notes,
      user_id: this.user_id,
    };
  }
}
