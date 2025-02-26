import { answer, assessmentAnswer, question } from "../db/schemas";

export interface ICalculateLevelAnswer {
  assessment_answer: typeof assessmentAnswer.$inferSelect;
  answer: typeof answer.$inferSelect;
  question: typeof question.$inferSelect;
}
