ALTER TABLE "image_asset" RENAME TO "image";--> statement-breakpoint
ALTER TABLE "image" RENAME COLUMN "id" TO "image_id";--> statement-breakpoint
ALTER TABLE "image" RENAME COLUMN "page" TO "image_page";--> statement-breakpoint
ALTER TABLE "image" RENAME COLUMN "name" TO "image_name";--> statement-breakpoint
ALTER TABLE "image" RENAME COLUMN "url" TO "image_url";--> statement-breakpoint
ALTER TABLE "image" ADD CONSTRAINT "image_image_page_image_name_unique" UNIQUE("image_page","image_name");