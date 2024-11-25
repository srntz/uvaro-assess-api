import {integer, pgTable, serial, text} from "drizzle-orm/pg-core";
import {questionTable} from "./question";

export const answerTable = pgTable("answer", {
  answer_id: serial().primaryKey(),
  answer_text: text().notNull(),
  weighting: integer().notNull(),
  question_id: integer().notNull().references(() => questionTable.question_id),
})
