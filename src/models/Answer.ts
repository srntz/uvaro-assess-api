import { BaseModel } from "./BaseModel";
import { IAnswer } from "../db/schemas";
import { InvalidModelConstructionException } from "../errors/InvalidModelConstructionException";

export class Answer implements BaseModel<IAnswer> {
  readonly answer_id: number;
  readonly answer_text: string;
  readonly weighting: number;
  readonly question_id: number;

  constructor(data: IAnswer) {
    try {
      this.answer_id = data.answer_id;
      this.answer_text = data.answer_text;
      this.weighting = data.weighting;
      this.question_id = data.question_id;
    } catch {
      throw new InvalidModelConstructionException(
        Object.getPrototypeOf(this).constructor.name,
      );
    }
  }

  createFullJsonObject(): IAnswer {
    return {
      answer_id: this.answer_id,
      answer_text: this.answer_text,
      weighting: this.weighting,
      question_id: this.question_id,
    };
  }

  createInsertableJsonObject(): IAnswer {
    return {
      answer_text: this.answer_text,
      weighting: this.weighting,
      question_id: this.question_id,
    };
  }
}
