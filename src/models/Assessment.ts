import {BasicModel} from "./BasicModel";

interface ConstructorArgument {
  assessment_id: number;
  start_date_time: string;
  end_date_time?: string;
  notes?: string;
  user_id: string;
}

export class Assessment implements BasicModel {
  private assessment_id: number;
  private start_date_time: string;
  private end_date_time: string | null;
  private notes: string | null;
  private user_id: string;

  constructor(assessmentData: ConstructorArgument) {
    this.assessment_id = assessmentData.assessment_id
    this.start_date_time = assessmentData.start_date_time
    this.end_date_time = assessmentData.end_date_time || null;
    this.notes = assessmentData.notes || null;
    this.user_id = assessmentData.user_id;
  }

  static instantiateFromSourceData(data: any) {

  }

  createFullJsonObject() {
    return {
      assessment_id: this.assessment_id,
      start_date_time: this.start_date_time,
      end_date_time: this.end_date_time,
      notes: this.notes,
      user_id: this.user_id,
    }
  }

  createInsertableJsonObject() {
    return {
      user_id: this.user_id,
    }
  }
}
