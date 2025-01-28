import {pgTable, serial, varchar, uuid} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  user_id: uuid().primaryKey().defaultRandom(),
  first_name: varchar({length: 50}).notNull(),
  last_name: varchar({length: 100}).notNull(),
  email: varchar({length: 255}).notNull(),
})

export type IUser = typeof user.$inferSelect
export type IUserInsert = typeof user.$inferInsert
