import { pgTable, serial, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./user";

export const assessment = pgTable("assessment", {
  assessment_id: serial().primaryKey(),
  start_date_time: timestamp().notNull().defaultNow(),
  end_date_time: timestamp(),
  user_id: uuid()
    .notNull()
    .references(() => user.user_id),
});

type AssessmentType = typeof assessment.$inferInsert;

export interface IAssessment extends AssessmentType {
  assessment_id?: number;
  start_date_time?: Date;
  end_date_time?: Date;
}
