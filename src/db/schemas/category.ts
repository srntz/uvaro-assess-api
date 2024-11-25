import {pgTable, serial, varchar} from "drizzle-orm/pg-core";

export const categoryTable = pgTable("category", {
  category_id: serial().primaryKey(),
  category_name: varchar({length: 100}).notNull(),
})
