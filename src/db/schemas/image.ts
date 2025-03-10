import { pgEnum, pgTable, text, unique, uuid } from "drizzle-orm/pg-core";

export const imageAssetPagePgEnum = pgEnum("image_asset_page", [
  "HOME",
  "DASHBOARD",
]);

export const image = pgTable(
  "image",
  {
    image_id: uuid().primaryKey().defaultRandom(),
    image_page: imageAssetPagePgEnum(),
    image_name: text().notNull(),
    image_url: text().notNull(),
  },
  (table) => [unique().on(table.image_page, table.image_name)],
);
