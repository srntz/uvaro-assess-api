import {IAnswer} from "../db/schemas";

export class Answer implements IAnswer {
    answer_id: number;
    answer_text: string;
    weighting: number;
    question_id: number;

    constructor(answerId: number, answerText: string, weighting: number, questionId: number) {
        this.answer_id = answerId;
        this.answer_text = answerText;
        this.weighting = weighting;
        this.question_id = questionId;
    }
}
