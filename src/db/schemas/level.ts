import {integer, pgTable, serial, text, varchar} from "drizzle-orm/pg-core";
import {category} from "./category";

export const level = pgTable("level", {
  level_id: serial().primaryKey(),
  level_name: varchar({length: 100}).notNull(),
  level_statement: text(),
  required_weighting: integer().notNull(),
  category_id: integer().notNull().references(() => category.category_id),
})
