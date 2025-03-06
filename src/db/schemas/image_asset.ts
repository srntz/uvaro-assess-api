import { pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const imageAssetPagePgEnum = pgEnum("image_asset_page", [
  "HOME",
  "DASHBOARD",
]);

export const imageAsset = pgTable("image_asset", {
  id: uuid().primaryKey().defaultRandom(),
  page: imageAssetPagePgEnum(),
  name: text().notNull(),
  url: text().notNull(),
});
