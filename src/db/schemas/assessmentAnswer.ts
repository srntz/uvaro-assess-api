import { integer, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { assessment } from "./assessment";
import { answer } from "./answer";

export const assessmentAnswer = pgTable(
  "assessment_answer",
  {
    assessment_id: integer()
      .notNull()
      .references(() => assessment.assessment_id),
    answer_id: integer()
      .notNull()
      .references(() => answer.answer_id),
  },
  (table) => {
    return {
      pk: primaryKey({
        name: "assessment_answer_primary_key",
        columns: [table.assessment_id, table.answer_id],
      }),
    };
  },
);

export type IAssessemntAnswer = typeof assessmentAnswer.$inferSelect;
