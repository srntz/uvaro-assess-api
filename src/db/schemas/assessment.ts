import {integer, pgTable, serial, text, timestamp} from "drizzle-orm/pg-core";
import {userTable} from "./user";

export const assessmentTable = pgTable("assessment", {
  assessment_id: serial().primaryKey(),
  start_date_time: timestamp().notNull(),
  end_date_time: timestamp().notNull(),
  notes: text().notNull(),
  user_id: integer().notNull().references(() => userTable.user_id)
})
