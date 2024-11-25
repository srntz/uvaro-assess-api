import {integer, pgTable, serial, text} from "drizzle-orm/pg-core";
import {question} from "./question";

export const answer = pgTable("answer", {
  answer_id: serial().primaryKey(),
  answer_text: text().notNull(),
  weighting: integer().notNull(),
  question_id: integer().notNull().references(() => question.question_id),
})
