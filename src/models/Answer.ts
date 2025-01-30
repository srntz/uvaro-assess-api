import {BasicModel} from "./BasicModel";
import {IAnswer} from "../db/schemas";
import {InvalidModelConstruction} from "../errors/InvalidModelConstruction";

export class Answer implements BasicModel<IAnswer> {
    private answer_id: number;
    private answer_text: string;
    private weighting: number;
    private question_id: number;

    constructor(data: IAnswer) {
        try {
            this.answer_id = data.answer_id;
            this.answer_text = data.answer_text;
            this.weighting = data.weighting
            this.question_id = data.question_id;
        } catch (e) {
            throw new InvalidModelConstruction(Object.getPrototypeOf(this).constructor.name)
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
