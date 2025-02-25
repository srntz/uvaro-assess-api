ALTER TABLE "level" ADD CONSTRAINT "level_level_id_category_id_unique" UNIQUE("level_id","category_id");
ALTER TABLE "assessment_level" ADD COLUMN "category_id" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "assessment_level" ADD CONSTRAINT "assessment_level_category_id_category_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("category_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "assessment_level" ADD CONSTRAINT "fk_category_level_relation" FOREIGN KEY ("category_id","level_id") REFERENCES "public"."level"("category_id","level_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "assessment_level" DROP CONSTRAINT "assessment_level_primary_key";
--> statement-breakpoint
ALTER TABLE "assessment_level" ADD CONSTRAINT "assessment_level_primary_key" PRIMARY KEY("assessment_id","category_id");--> statement-breakpoint
