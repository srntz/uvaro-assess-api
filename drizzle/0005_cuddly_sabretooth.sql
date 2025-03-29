CREATE TABLE IF NOT EXISTS "weighting" (
	"weighting_id" integer PRIMARY KEY NOT NULL,
	"weighting" integer NOT NULL,
	CONSTRAINT "weighting_weighting_id_weighting_unique" UNIQUE("weighting_id","weighting")
);
--> statement-breakpoint
ALTER TABLE "answer" ADD COLUMN "weighting_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "level" ADD COLUMN "weighting_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "question" ADD COLUMN "weighting_coefficient" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "answer" ADD CONSTRAINT "answer_weighting_id_weighting_weighting_id_fk" FOREIGN KEY ("weighting_id") REFERENCES "public"."weighting"("weighting_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "level" ADD CONSTRAINT "level_weighting_id_weighting_weighting_id_fk" FOREIGN KEY ("weighting_id") REFERENCES "public"."weighting"("weighting_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "answer" DROP COLUMN IF EXISTS "weighting";--> statement-breakpoint
ALTER TABLE "level" DROP COLUMN IF EXISTS "required_weighting";--> statement-breakpoint
ALTER TABLE "question" ADD CONSTRAINT "weighting_coefficient_check" CHECK ("question"."weighting_coefficient" >= 1 AND "question"."weighting_coefficient" <= 10);