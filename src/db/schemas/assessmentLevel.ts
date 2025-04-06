import { foreignKey, integer, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { assessment } from "./assessment.js";
import { level } from "./level.js";
import { category } from "./category.js";

export const assessmentLevel = pgTable(
  "assessment_level",
  {
    assessment_id: integer()
      .notNull()
      .references(() => assessment.assessment_id, { onDelete: "cascade" }),
    category_id: integer()
      .notNull()
      .references(() => category.category_id),
    level_id: integer()
      .notNull()
      .references(() => level.level_id),
  },
  (table) => {
    return {
      pk: primaryKey({
        name: "assessment_level_primary_key",
        columns: [table.assessment_id, table.category_id],
      }),
      fk: foreignKey({
        name: "fk_category_level_relation",
        columns: [table.category_id, table.level_id],
        foreignColumns: [level.category_id, level.level_id],
      }),
    };
  },
);

export type IAssessmentLevel = typeof assessmentLevel.$inferSelect;
