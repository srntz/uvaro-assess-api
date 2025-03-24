import {
  boolean,
  check,
  integer,
  pgTable,
  serial,
  text,
} from "drizzle-orm/pg-core";
import { category } from "./category";
import { relations, sql } from "drizzle-orm";
import { answer } from "./answer";

export const question = pgTable(
  "question",
  {
    question_id: serial().primaryKey(),
    question_text: text().notNull(),
    weighting_coefficient: integer().notNull(),
    category_id: integer()
      .notNull()
      .references(() => category.category_id),
    follow_up: boolean().notNull(),
  },
  (table) => [
    check(
      "weighting_coefficient_check",
      sql`${table.weighting_coefficient} >= 1 AND ${table.weighting_coefficient} <= 10`,
    ),
  ],
);

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
