import {IAnswer, IQuestion} from "../db/schemas";

export class Question implements IQuestion {
    answers: IAnswer[] = [];
    category_id: number;
    question_id: number;
    question_text: string;

    constructor(questionId: number, questionText: string, categoryId: number) {
        this.question_id = questionId;
        this.question_text = questionText;
        this.category_id = categoryId;
    }
}
