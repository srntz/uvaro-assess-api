import {IAnswer} from "../db/schemas";

export class Answer implements IAnswer {
    answer_id: number;
    answer_text: string;
    weighting: number;
    question_id: number;
}
