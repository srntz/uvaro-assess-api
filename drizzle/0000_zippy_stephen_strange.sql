CREATE TABLE IF NOT EXISTS "answer" (
	"answer_id" serial PRIMARY KEY NOT NULL,
	"answer_text" text NOT NULL,
	"weighting" integer NOT NULL,
	"question_id" integer NOT NULL,
	CONSTRAINT "answer_answer_id_question_id_unique" UNIQUE("answer_id","question_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "assessment" (
	"assessment_id" serial PRIMARY KEY NOT NULL,
	"start_date_time" timestamp NOT NULL,
	"end_date_time" timestamp,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "assessment_answer" (
	"assessment_id" integer NOT NULL,
	"question_id" integer NOT NULL,
	"answer_id" integer NOT NULL,
	CONSTRAINT "assessment_answer_primary_key" PRIMARY KEY("assessment_id","question_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "assessment_level" (
	"assessment_id" integer NOT NULL,
	"level_id" integer NOT NULL,
	CONSTRAINT "assessment_level_primary_key" PRIMARY KEY("level_id","assessment_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "category" (
	"category_id" serial PRIMARY KEY NOT NULL,
	"category_name" varchar(100) NOT NULL,
	"category_description" text NOT NULL,
	"category_image" varchar(2048) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "level" (
	"level_id" serial PRIMARY KEY NOT NULL,
	"level_name" varchar(100) NOT NULL,
	"level_statement" text NOT NULL,
	"required_weighting" integer NOT NULL,
	"category_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "question" (
	"question_id" serial PRIMARY KEY NOT NULL,
	"question_text" text NOT NULL,
	"category_id" integer NOT NULL,
	"follow_up" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"user_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(50) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "note" (
	"category_id" integer NOT NULL,
	"assessment_id" integer NOT NULL,
	"note_text" text NOT NULL,
	CONSTRAINT "note_primary_key" PRIMARY KEY("category_id","assessment_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "answer" ADD CONSTRAINT "answer_question_id_question_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."question"("question_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "assessment" ADD CONSTRAINT "assessment_user_id_user_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "assessment_answer" ADD CONSTRAINT "assessment_answer_assessment_id_assessment_assessment_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."assessment"("assessment_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "assessment_answer" ADD CONSTRAINT "assessment_answer_question_id_question_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."question"("question_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "assessment_answer" ADD CONSTRAINT "assessment_answer_answer_id_answer_answer_id_fk" FOREIGN KEY ("answer_id") REFERENCES "public"."answer"("answer_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "assessment_answer" ADD CONSTRAINT "fk_answer_question_relation" FOREIGN KEY ("answer_id","question_id") REFERENCES "public"."answer"("answer_id","question_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "assessment_level" ADD CONSTRAINT "assessment_level_assessment_id_assessment_assessment_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."assessment"("assessment_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "assessment_level" ADD CONSTRAINT "assessment_level_level_id_level_level_id_fk" FOREIGN KEY ("level_id") REFERENCES "public"."level"("level_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "level" ADD CONSTRAINT "level_category_id_category_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("category_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "question" ADD CONSTRAINT "question_category_id_category_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("category_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "note" ADD CONSTRAINT "note_category_id_category_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("category_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "note" ADD CONSTRAINT "note_assessment_id_assessment_assessment_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."assessment"("assessment_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
