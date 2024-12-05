import {integer, pgTable, serial, text} from "drizzle-orm/pg-core";
import {question} from "./question";
import {relations} from "drizzle-orm";

export const answer = pgTable("answer", {
  answer_id: serial().primaryKey(),
  answer_text: text().notNull(),
  weighting: integer().notNull(),
  question_id: integer().notNull().references(() => question.question_id),
})

export const answerRelations = relations(answer, ({one}) => ({
  question: one(question, {
    fields: [answer.question_id],
    references: [question.question_id],
  }),
}))

type AnswerType = typeof answer.$inferSelect

export interface IAnswer extends AnswerType {}
