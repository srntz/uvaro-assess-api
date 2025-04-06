import { answer, assessmentAnswer, question } from "../db/schemas/index.js";

export interface ICalculateLevelAnswer {
  assessment_answer: typeof assessmentAnswer.$inferSelect;
  answer: typeof answer.$inferSelect;
  question: typeof question.$inferSelect;
}
