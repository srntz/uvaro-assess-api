import { foreignKey, integer, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { assessment } from "./assessment.js";
import { answer } from "./answer.js";
import { question } from "./question.js";

export const assessmentAnswer = pgTable(
  "assessment_answer",
  {
    assessment_id: integer()
      .notNull()
      .references(() => assessment.assessment_id, { onDelete: "cascade" }),
    question_id: integer()
      .notNull()
      .references(() => question.question_id),
    answer_id: integer()
      .notNull()
      .references(() => answer.answer_id),
  },
  (table) => {
    return {
      pk: primaryKey({
        name: "assessment_answer_primary_key",
        columns: [table.assessment_id, table.question_id],
      }),
      fk: foreignKey({
        name: "fk_answer_question_relation",
        columns: [table.answer_id, table.question_id],
        foreignColumns: [answer.answer_id, answer.question_id],
      }),
    };
  },
);

export type IAssessemntAnswer = typeof assessmentAnswer.$inferSelect;
