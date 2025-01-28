import {pgTable, serial, text, timestamp, uuid} from "drizzle-orm/pg-core";
import {user} from "./user";

export const assessment = pgTable("assessment", {
  assessment_id: serial().primaryKey(),
  start_date_time: timestamp().notNull(),
  end_date_time: timestamp(),
  notes: text().notNull(),
  user_id: uuid().notNull().references(() => user.user_id)
})
