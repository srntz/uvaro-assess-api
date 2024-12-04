import {integer, pgTable, primaryKey} from "drizzle-orm/pg-core";
import {assessment} from "./assessment";
import {level} from "./level";

export const assessmentLevel = pgTable("assessment_level", {
  assessment_id: integer().notNull().references(() => assessment.assessment_id),
  level_id: integer().notNull().references(() => level.level_id),
}, (table) => {
  return {
    pk: primaryKey({name: "assessment_level_primary_key", columns: [table.level_id, table.assessment_id]})
  }
})
