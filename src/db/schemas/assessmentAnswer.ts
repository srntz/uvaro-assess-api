import {integer, pgTable, primaryKey, serial} from "drizzle-orm/pg-core";
import {assessmentTable} from "./assessment";
import {answerTable} from "./answer";

export const assessmentAnswerTable = pgTable("assessment_answer", {
  assessment_id: integer().notNull().references(() => assessmentTable.assessment_id),
  answer_id: integer().notNull().references(() => answerTable.answer_id),
}, (table) => {
  return {
    pk: primaryKey({name: "assessment_answer_primary_key", columns: [table.assessment_id, table.answer_id]})
  }
})
