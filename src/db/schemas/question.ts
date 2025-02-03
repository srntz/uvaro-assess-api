import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { category } from "./category";
import { relations } from "drizzle-orm";
import { answer } from "./answer";

export const question = pgTable("question", {
  question_id: serial().primaryKey(),
  question_text: text().notNull(),
  category_id: integer()
    .notNull()
    .references(() => category.category_id),
});

export const questionRelations = relations(question, ({ one, many }) => ({
  category: one(category, {
    fields: [question.category_id],
    references: [category.category_id],
  }),
  answers: many(answer),
}));

type QuestionType = typeof question.$inferInsert;

export interface IQuestion extends QuestionType {
  question_id?: number;
}
