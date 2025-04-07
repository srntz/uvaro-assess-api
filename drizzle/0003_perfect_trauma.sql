ALTER TABLE "assessment" DROP CONSTRAINT "assessment_user_id_user_user_id_fk";
--> statement-breakpoint
ALTER TABLE "assessment_answer" DROP CONSTRAINT "assessment_answer_assessment_id_assessment_assessment_id_fk";
--> statement-breakpoint
ALTER TABLE "assessment_level" DROP CONSTRAINT "assessment_level_assessment_id_assessment_assessment_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "assessment" ADD CONSTRAINT "assessment_user_id_user_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "assessment_answer" ADD CONSTRAINT "assessment_answer_assessment_id_assessment_assessment_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."assessment"("assessment_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "assessment_level" ADD CONSTRAINT "assessment_level_assessment_id_assessment_assessment_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."assessment"("assessment_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
