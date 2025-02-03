import { pgTable, varchar, uuid } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  user_id: uuid().primaryKey().defaultRandom(),
  first_name: varchar({ length: 50 }).notNull(),
  last_name: varchar({ length: 100 }).notNull(),
  email: varchar({ length: 255 }).notNull(),
});

type User = typeof user.$inferInsert;

export interface IUser extends User {
  user_id?: string;
}
