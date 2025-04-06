import { integer, pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { category } from "./category.js";
import { assessment } from "./assessment.js";

export const note = pgTable(
  "note",
  {
    category_id: integer()
      .notNull()
      .references(() => category.category_id),
    assessment_id: integer()
      .notNull()
      .references(() => assessment.assessment_id),
    note_text: text().notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({
        name: "note_primary_key",
        columns: [table.category_id, table.assessment_id],
      }),
    };
  },
);

export type INote = typeof note.$inferInsert;
