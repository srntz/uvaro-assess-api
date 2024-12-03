import {integer, pgTable, serial, text, varchar} from "drizzle-orm/pg-core";
import {categoryTable} from "./category";

export const levelTable = pgTable("level", {
  level_id: serial().primaryKey(),
  level_name: varchar({length: 100}).notNull(),
  level_statement: text(),
  required_weighting: integer().notNull(),
  category_id: integer().notNull().references(() => categoryTable.category_id),
})
