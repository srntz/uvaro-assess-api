import {integer, pgTable, primaryKey} from "drizzle-orm/pg-core";
import {assessmentTable} from "./assessment";
import {levelTable} from "./level";

export const assessmentLevelTable = pgTable("assessment_level", {
  assessment_id: integer().notNull().references(() => assessmentTable.assessment_id),
  level_id: integer().notNull().references(() => levelTable.level_id),
}, (table) => {
  return {
    pk: primaryKey({name: "assessment_level_primary_key", columns: [table.level_id, table.assessment_id]})
  }
})
