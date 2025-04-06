import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { question } from "./question.js";

export const category = pgTable("category", {
  category_id: serial().primaryKey(),
  category_name: varchar({ length: 100 }).notNull(),
  category_description: text().notNull(),
  category_image: varchar({ length: 2048 }).notNull(),
});

export const categoryRelations = relations(category, ({ many }) => ({
  questions: many(question),
}));

export type CategoryType = typeof category.$inferInsert;

export interface ICategory extends CategoryType {
  category_id?: number;
}
