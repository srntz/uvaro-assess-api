import {pgTable, serial, varchar} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";
import {question} from "./question";

export const category = pgTable("category", {
  category_id: serial().primaryKey(),
  category_name: varchar({length: 100}).notNull(),
})

export const categoryRelations = relations(category, ({many}) => ({
  questions: many(question)
}))
