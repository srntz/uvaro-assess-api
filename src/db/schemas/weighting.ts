import { integer, pgTable } from "drizzle-orm/pg-core";
import { unique } from "drizzle-orm/pg-core";

export const weighting = pgTable(
  "weighting",
  {
    weighting_id: integer().primaryKey(),
    weighting: integer().notNull(),
  },
  (table) => [unique().on(table.weighting_id, table.weighting)],
);
