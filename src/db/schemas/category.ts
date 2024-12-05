import {pgTable, serial, varchar} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";
import {IQuestion, question} from "./question";
import {ILevel} from "./level";

export const category = pgTable("category", {
  category_id: serial().primaryKey(),
  category_name: varchar({length: 100}).notNull(),
})

export const categoryRelations = relations(category, ({many}) => ({
  questions: many(question)
}))

export type CategoryType = typeof category.$inferSelect

export interface ICategory extends CategoryType {
  questions: IQuestion[]
  levels: ILevel[]
}
