import { IQuestion } from "../db/schemas";
import { BaseModel } from "./BaseModel";
import { InvalidModelConstructionException } from "../errors/InvalidModelConstructionException";

export class Question implements BaseModel<IQuestion> {
  readonly question_id: number | undefined;
  readonly category_id: number;
  readonly question_text: string;

  constructor(data: IQuestion) {
    try {
      this.question_id = data.question_id;
      this.question_text = data.question_text;
      this.category_id = data.category_id;
    } catch (e) {
      throw new InvalidModelConstructionException(
        Object.getPrototypeOf(this).constructor.name,
      );
    }
  }

  createFullJsonObject(): IQuestion {
    return {
      question_id: this.question_id,
      category_id: this.category_id,
      question_text: this.question_text,
    };
  }

  createInsertableJsonObject(): IQuestion {
    return {
      question_text: this.question_text,
      category_id: this.category_id,
    };
  }
}
