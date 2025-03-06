CREATE TYPE "public"."image_asset_page" AS ENUM('HOME', 'DASHBOARD');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "image_asset" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page" "image_asset_page",
	"name" text NOT NULL,
	"url" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "level" ADD COLUMN "image_url" text;
UPDATE "level" SET "image_url" = 'IMAGE_URL_PLACEHOLDER' WHERE "image_url" IS NULL;
ALTER TABLE "level" ALTER COLUMN "image_url" SET NOT NULL
