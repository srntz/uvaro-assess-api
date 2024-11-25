import {integer, pgTable, serial, text} from "drizzle-orm/pg-core";
import {category} from "./category";

export const question = pgTable("question", {
  question_id: serial().primaryKey(),
  question_text: text().notNull(),
  category_id: integer().notNull().references(() => category.category_id),
})
