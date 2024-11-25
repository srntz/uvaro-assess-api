import {pgTable, serial, varchar} from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
  user_id: serial().primaryKey(),
  first_name: varchar({length: 50}),
  last_name: varchar({length: 100}),
  email: varchar({length: 255}),
})
