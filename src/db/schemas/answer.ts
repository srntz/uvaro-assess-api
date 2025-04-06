import { integer, pgTable, serial, text, unique } from "drizzle-orm/pg-core";
import { question } from "./question.js";
import { relations } from "drizzle-orm";
import { weighting } from "./weighting.js";

export const answer = pgTable(
  "answer",
  {
    answer_id: serial().primaryKey(),
    answer_text: text().notNull(),
    weighting_id: integer()
      .notNull()
      .references(() => weighting.weighting_id),
    question_id: integer()
      .notNull()
      .references(() => question.question_id),
  },
  (table) => [unique().on(table.answer_id, table.question_id)],
);

export const answerRelations = relations(answer, ({ one }) => ({
  question: one(question, {
    fields: [answer.question_id],
    references: [question.question_id],
  }),
}));

type AnswerType = typeof answer.$inferInsert;

export interface IAnswer extends AnswerType {
  answer_id?: number;
}
