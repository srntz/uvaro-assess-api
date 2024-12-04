import {ICategory, ILevel, IQuestion} from "../db/schemas";

export class Category implements ICategory {
    questions: IQuestion[] = [];
    levels: ILevel[] = [];
    category_id: number;
    category_name: string;

    public addQuestion(question: IQuestion) {
      this.questions.push(question);
    }

    public addLevel(level: ILevel) {
      this.levels.push(level);
    }
}
