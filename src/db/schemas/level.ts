import {
  integer,
  pgTable,
  serial,
  text,
  unique,
  varchar,
} from "drizzle-orm/pg-core";
import { category } from "./category";

export const level = pgTable(
  "level",
  {
    level_id: serial().primaryKey(),
    level_name: varchar({ length: 100 }).notNull(),
    level_statement: text().notNull(),
    required_weighting: integer().notNull(),
    image_url: text().notNull(),
    category_id: integer()
      .notNull()
      .references(() => category.category_id),
  },
  (table) => [unique().on(table.level_id, table.category_id)],
);

type LevelType = typeof level.$inferInsert;

export interface ILevel extends LevelType {
  level_id?: number;
  level_statement: string;
}
