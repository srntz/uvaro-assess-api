import {ICategory, ILevel, IQuestion} from "../db/schemas";

export class Category implements ICategory {
    questions: IQuestion[] = [];
    levels: ILevel[] = [];
    category_id: number;
    category_name: string;

    constructor(categoryId: number, categoryName: string) {
      this.category_id = categoryId;
      this.category_name = categoryName;
    }

    public addQuestion(question: IQuestion) {
      this.questions.push(question);
    }

    public addLevel(level: ILevel) {
      this.levels.push(level);
    }
}
