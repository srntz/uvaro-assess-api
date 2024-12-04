import {IAnswer, IQuestion} from "../db/schemas";

export class Question implements IQuestion {
    answers: IAnswer[];
    category_id: number;
    question_id: number;
    question_text: string;
}
