import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { category } from "./category";
import { assessment } from "./assessment";

export const note = pgTable("note", {
  category_id: integer()
    .primaryKey()
    .references(() => category.category_id),
  assessment_id: integer()
    .primaryKey()
    .references(() => assessment.assessment_id),
  note_text: text().notNull(),
});

export type INote = typeof note.$inferInsert;
