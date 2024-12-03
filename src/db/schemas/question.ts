import {integer, pgTable, serial, text} from "drizzle-orm/pg-core";
import {categoryTable} from "./category";

export const questionTable = pgTable("question", {
  question_id: serial().primaryKey(),
  question_text: text().notNull(),
  category_id: integer().notNull().references(() => categoryTable.category_id),
})
