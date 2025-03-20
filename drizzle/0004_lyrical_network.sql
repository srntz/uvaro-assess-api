ALTER TABLE "assessment" DROP CONSTRAINT "assessment_user_id_user_user_id_fk";

ALTER TABLE "user" ALTER COLUMN "user_id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "user_id" DROP DEFAULT;
ALTER TABLE "assessment" ALTER COLUMN "user_id" SET DATA TYPE varchar(255);--> statement-breakpoint

DO $$ BEGIN
ALTER TABLE "assessment" ADD CONSTRAINT "assessment_user_id_user_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
