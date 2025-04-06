import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { user } from "./user.js";

export const assessment = pgTable("assessment", {
  assessment_id: serial().primaryKey(),
  start_date_time: timestamp().notNull().defaultNow(),
  end_date_time: timestamp(),
  user_id: varchar({ length: 255 })
    .notNull()
    .references(() => user.user_id, { onDelete: "cascade" }),
});

type AssessmentType = typeof assessment.$inferInsert;

export interface IAssessment extends AssessmentType {
  assessment_id?: number;
  start_date_time?: Date;
  end_date_time?: Date;
}
