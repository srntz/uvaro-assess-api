import {pgTable, serial, varchar, uuid} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  user_id: uuid().primaryKey().defaultRandom(),
  first_name: varchar({length: 50}),
  last_name: varchar({length: 100}),
  email: varchar({length: 255}),
})
